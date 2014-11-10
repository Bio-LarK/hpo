<?php

class HPOImport {

    private $hpo_list = array();
    private $disease_list = array();
    private $hpo_classification_list = array();
    private $syntype_list = array();

    public function __construct() {
    }

    public function __destruct() {
    }

    public function create_disease_list() {
        $response = file_get_contents("http://130.56.248.140:8080/hpo/import?get=all_diseases");
        $json = json_decode($response);

        foreach($json as $key => $id) {
            $disease_nid = $this->create_disease($id);
            $this->disease_list[$id] = $disease_nid;
        }
    }

    public function create_hpo_list() {
        $response = file_get_contents("http://130.56.248.140:8080/hpo/import?get=all_uris");
        $json = json_decode($response);

        foreach($json as $key => $uri) {
            $hpo_nid = $this->create_hpo($uri);
            $this->hpo_list[$uri] = $hpo_nid;
        }
    }

    public function create_hpo_classification() {
        $response = file_get_contents("http://130.56.248.140:8080/hpo/import?get=top");
        $json = json_decode($response);

        foreach($json as $uri => $label) {
            $class_nid = $this->create_classification($uri, $label);
            $this->hpo_classification_list[$uri] = $class_nid;
        }
    }

    private function create_classification($uri, $label) {
        $class_node = new stdClass();
        $class_node->type = 'disorder_classification';
        $class_node->language = 'und';
        $class_node->uid = 1;
        $class_node->title = $label;
        $class_node->field_disorder_class_name['und'][0]['value'] = $label;
        $class_node->field_disorder_class_root['und'][0]['target_id'] = $this->hpo_list[$uri];
        node_save($class_node);

        $hpo_node = node_load($this->hpo_list[$uri]);
        $hpo_node->field_disorder_class['und'][0]['target_id'] = $class_node->nid;
        node_save($hpo_node);

        return $class_node->nid;
    }

    public function create_disease_concepts() {
        foreach($this->disease_list as $id => $disease_nid) {
            $this->create_disease_concept($id, $disease_nid);
        }
    }

    public function create_hpo_concepts() {
        foreach($this->hpo_list as $uri => $hpo_nid) {
            $this->create_concept($uri, $hpo_nid);
        }
    }

    private function create_disease($disease_id) {
        $disease_node = new stdClass();
        $disease_node->type = 'clinical_sign';
        $disease_node->language = 'und';
        $disease_node->uid = 1;
        $disease_node->title = $disease_id;
        $disease_node->field_sign_id['und'][0]['value'] = $disease_id;
        node_save($disease_node);
        return $disease_node->nid;
    }

    private function create_hpo($hpo_uri) {
        $hpo_node = new stdClass();
        $hpo_node->type = 'disorder';
        $hpo_node->language = 'und';
        $hpo_node->uid = 1;
        $hpo_node->title = $hpo_uri;
        $hpo_node->field_disorder_uri['und'][0]['value'] = $hpo_uri;
        node_save($hpo_node);
        return $hpo_node->nid;
    }

    private function create_disease_concept($id, $disease_nid) {
        $response = file_get_contents("http://130.56.248.140:8080/hpo/import?disease=$id");
        $json = json_decode($response);

        $disease_node = node_load($disease_nid);
        $disease_node->title = $json->name;
        $disease_node->field_sign_name['und'][0]['value'] = $json->name;
        $disease_node->field_sign_prov['und'][0]['value'] = $json->prov;

        $hpo_annot = $json->hpo;
        $count = 0;
        foreach($hpo_annot as $hpo_uri) {
            $annot_nid = $this->create_annot($disease_nid, $hpo_uri);
            if ($annot_nid != -1) {
                $disease_node->field_sign_dissign['und'][$count]['target_id'] = $annot_nid;
                $count++;
            }
        }

        node_save($disease_node);
    }

    private function create_annot($disease_nid, $hpo_uri) {
        if (array_key_exists($hpo_uri, $this->hpo_list)) {
            $hpo_nid = $this->hpo_list[$hpo_uri];

            $dissign_node = new stdClass();
            $dissign_node->type = 'disorder_sign';
            $dissign_node->language = 'und';
            $dissign_node->uid = 1;
            $dissign_node->title = 'Disorder-sign';
            $dissign_node->field_ds_sign['und'][0]['target_id'] = $disease_nid;
            $dissign_node->field_ds_disorder['und'][0]['target_id'] = $hpo_nid;
            node_save($dissign_node);

            $dissign_nid = $dissign_node->nid;

            $hpo_node = node_load($hpo_nid);
            $current_count = 0;
            if (array_key_exists('und', $hpo_node->field_disorder_phenotype)) {
                $current_count = sizeof($hpo_node->field_disorder_phenotype['und']);
            }
            $hpo_node->field_disorder_phenotype['und'][$current_count]['target_id'] = $dissign_nid;
            node_save($hpo_node);

            return $dissign_nid;
        }

        return -1;
    }

    private function create_concept($uri, $hpo_nid) {
        $index = strrpos($uri, "/");
        $short_uri = substr($uri, $index + 1);

        $response = file_get_contents("http://130.56.248.140:8080/hpo/import?get=$short_uri");
        $json = json_decode($response);

        $hpo_node = node_load($hpo_nid);
        $hpo_node->title = $json->label;
        $hpo_node->field_disorder_label['und'][0]['value'] = $json->label;
        $hpo_node->field_disorder_nochildren['und'][0]['value'] = $json->no_subclasses;

        $alt_ids = $json->alt_ids;
        $count = 0;
        foreach($alt_ids as $alt_id) {
            $hpo_node->field_disorder_altid['und'][$count]['value'] = $alt_id;
            $count++;
        }

        $classifications = $json->classification;
        $count = 0;
        foreach($classifications as $classification) {
            $class_nid = $this->hpo_classification_list[$classification];
            $hpo_node->field_disorder_class['und'][$count]['target_id'] = $class_nid;
            $count++;
        }

        if (array_key_exists($uri, $this->hpo_classification_list)) {
            $hpo_node->field_disorder_root['und'][$count]['value'] = '1';
        } else {
            $hpo_node->field_disorder_root['und'][$count]['value'] = '0';
        }

        $parents = $json->parents;
        $count = 0;
        foreach($parents as $parent) {
            $parent_nid = $this->hpo_list[$parent];
            $hpo_node->field_disorder_parent['und'][$count]['target_id'] = $parent_nid;
            $count++;
        }

        $children = $json->children;
        $count = 0;
        foreach($children as $child) {
            $child_nid = $this->hpo_list[$child];
            $hpo_node->field_disorder_child['und'][$count]['target_id'] = $child_nid;
            $count++;
        }

        $count = 0;
        $synonyms = $json->synonyms;
        foreach($synonyms as $syn_type => $syn_class) {
            if (!array_key_exists($syn_type, $this->syntype_list)) {
                $syntype_nid = $this->create_synonymtype($syn_type, $syn_class->uri);
                $this->syntype_list[$syn_type] = $syntype_nid;
            }

            $syntype_nid = $this->syntype_list[$syn_type];
            $syn_values = $syn_class->values;

            foreach($syn_values as $synonym) {
                $synonym_nid = $this->create_synonym($synonym, $syntype_nid);
                $hpo_node->field_disorder_synonym['und'][$count]['target_id'] = $synonym_nid;
                $count++;
            }
        }

        node_save($hpo_node);
    }

    private function create_synonymtype($syn_type, $syn_type_uri) {
        $syntype_node = new stdClass();
        $syntype_node->type = 'hpo_synonym_type';
        $syntype_node->language = 'und';
        $syntype_node->uid = 1;
        $syntype_node->title = $syn_type;

        $syntype_node->field_syntype_uri['und'][0]['value'] = $syn_type_uri;
        $syntype_node->field_syntype_value['und'][0]['value'] = $syn_type;

        node_save($syntype_node);
        return $syntype_node->nid;
    }

    private function create_synonym($synonym, $syntype_nid) {
        $synonym_node = new stdClass();
        $synonym_node->type = 'hpo_synonym';
        $synonym_node->language = 'und';
        $synonym_node->uid = 1;
        $synonym_node->title = $synonym;

        $synonym_node->field_synonym_value['und'][0]['value'] = $synonym;
        $synonym_node->field_synonym_type['und'][0]['target_id'] = $syntype_nid;

        node_save($synonym_node);
        return $synonym_node->nid;
    }
} 