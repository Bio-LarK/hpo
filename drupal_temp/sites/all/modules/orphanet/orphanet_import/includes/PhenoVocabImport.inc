<?php

class PhenoVocabImport {

    private $pheno_vocab_data;

    private $pheno_list = array();
    private $pheno_children = array();

    public function __construct($pheno_vocab_file) {
        $this->pheno_vocab_data = simplexml_load_file($pheno_vocab_file);
    }

    public function __destruct() {
        unset($this->pheno_vocab_data);
    }

    public function load_data() {
        foreach($this->pheno_vocab_data->ClinicalSignList[0] as $clinical_sign) {
            $this->parse_clinical_sign($clinical_sign);
        }

        foreach($this->pheno_list as $cs_id => $nid) {
            if (array_key_exists($cs_id, $this->pheno_children)) {
                $children = $this->pheno_children[$cs_id];

                $this->add_children($nid, $children);
            }
        }
    }

    public function get_pheno_list() {
        return $this->pheno_list;
    }

    private function add_children($nid, $children) {
        $cs_node = node_load($nid);

        $count = 0;
        foreach($children as $child) {
            $child_nid = $this->pheno_list[(string) $child];
            $cs_node->field_sign_child['und'][$count]['target_id'] = $child_nid;

            $child_node = node_load($child_nid);
            $current_count = 0;
            if (array_key_exists('und', $child_node->field_sign_parent)) {
                $current_count = sizeof($child_node->field_sign_parent['und']);
            }
            $child_node->field_sign_parent['und'][$current_count]['target_id'] = $nid;
            node_save($child_node);

            $count++;
        }

        node_save($cs_node);
    }

    private function parse_clinical_sign($clinical_sign) {
        $cs_id = $clinical_sign['id'];
        if (!array_key_exists((string) $cs_id, $this->pheno_list)) {
            $nid = $this->create_clinical_sign($clinical_sign);
            $this->pheno_list[(string) $cs_id] = $nid;
        }

        if (sizeof($clinical_sign->ClinicalSignChildList[0]) !== 0) {
            if (!array_key_exists((string) $cs_id, $this->pheno_children)) {
                $children = array();
                foreach($clinical_sign->ClinicalSignChildList[0] as $child_sign) {
                    array_push($children, $child_sign['id']);
                }

                $this->pheno_children[(string) $cs_id] = $children;
            }

            foreach($clinical_sign->ClinicalSignChildList[0] as $child_sign) {
                $this->parse_clinical_sign($child_sign);
            }
        }
    }

    private function create_clinical_sign($clinical_sign) {
        $name = $clinical_sign->Name;
        if ($name == '') {
            $name = '_NO_NAME_';
        }
        $id = $clinical_sign['id'];

        $sign_node = new stdClass();
        $sign_node->type = 'clinical_sign';
        $sign_node->language = 'und';
        $sign_node->uid = 1;
        $sign_node->title = $name;
        $sign_node->field_sign_name['und'][0]['value'] = $name;
        $sign_node->field_sign_orphaid['und'][0]['value'] = $id;

//        return $id;
        node_save($sign_node);
        return $sign_node->nid;
    }

} 