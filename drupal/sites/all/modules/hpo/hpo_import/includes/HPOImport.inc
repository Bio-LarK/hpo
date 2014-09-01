<?php

class HPOImport {

    private $hpo_list = array();
    private $syntype_list = array();

    public function __construct() {
    }

    public function __destruct() {
    }

    public function create_hpo_list() {
        $response = file_get_contents("http://130.56.248.140:8080/hpo/import?get=all_uris");
        $json = json_decode($response);

        foreach($json as $key => $uri) {
            $hpo_nid = $this->create_hpo($uri);
            $this->hpo_list[$uri] = $hpo_nid;
        }
    }

    public function create_hpo_concepts() {
        foreach($this->hpo_list as $uri => $hpo_nid) {
            $this->create_concept($uri, $hpo_nid);
        }
    }

    private function create_hpo($hpo_uri) {
        $hpo_node = new stdClass();
        $hpo_node->type = 'hpo_concept';
        $hpo_node->language = 'und';
        $hpo_node->uid = 1;
        $hpo_node->title = $hpo_uri;
        $hpo_node->field_concept_uri['und'][0]['value'] = $hpo_uri;
        node_save($hpo_node);
        return $hpo_node->nid;
    }

    private function create_concept($uri, $hpo_nid) {
        $index = strrpos($uri, "/");
        $short_uri = substr($uri, $index + 1);

        $response = file_get_contents("http://130.56.248.140:8080/hpo/import?get=$short_uri");
        $json = json_decode($response);

        $hpo_node = node_load($hpo_nid);
        $hpo_node->title = $json->label;
        $hpo_node->field_concept_label['und'][0]['value'] = $json->label;

        $alt_ids = $json->alt_ids;
        $count = 0;
        foreach($alt_ids as $alt_id) {
            $hpo_node->field_concept_altid['und'][$count]['value'] = $alt_id;
            $count++;
        }

        $parents = $json->parents;
        $count = 0;
        foreach($parents as $parent) {
            $parent_nid = $this->hpo_list[$parent];
            $hpo_node->field_concept_parent['und'][$count]['target_id'] = $parent_nid;
            $count++;
        }

        $children = $json->children;
        $count = 0;
        foreach($children as $child) {
            $child_nid = $this->hpo_list[$child];
            $hpo_node->field_concept_child['und'][$count]['target_id'] = $child_nid;
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
                $hpo_node->field_concept_synonym['und'][$count]['target_id'] = $synonym_nid;
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
