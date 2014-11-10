<?php

class DisorderPhenoImport {

    private $disorder_list;
    private $pheno_list;

    private $sign_freq_list = array();

    public function __construct($disorder_list, $pheno_list) {
        $this->disorder_list = $disorder_list;
        $this->pheno_list = $pheno_list;
    }

    public function __destruct() {
    }

    public function load_data($disorders_pheno_file) {
        $pheno_data = simplexml_load_file($disorders_pheno_file);

        foreach($pheno_data->DisorderList[0] as $disorder) {
            $disorder_nid = $this->disorder_list[(string) $disorder['id']];
            $disorder_node = node_load($disorder_nid);

            $pheno_count = 0;
            foreach($disorder->DisorderSignList[0] as $disorder_sign) {
                $clinical_sign_id = $disorder_sign->ClinicalSign['id'];
                $clinical_sign_nid = $this->pheno_list[(string) $clinical_sign_id];
                $clinical_sign_node = node_load($clinical_sign_nid);

                $sign_freq_nid = $this->create_frequency($disorder_sign->SignFreq);

                $disorder_pheno_nid = $this->create_association($disorder_nid, $clinical_sign_nid, $sign_freq_nid);

                $current_count = 0;
                if (array_key_exists('und', $clinical_sign_node->field_sign_dissign)) {
                    $current_count = sizeof($clinical_sign_node->field_sign_dissign['und']);
                }
                $clinical_sign_node->field_sign_dissign['und'][$current_count]['target_id'] = $disorder_pheno_nid;
                node_save($clinical_sign_node);

                $disorder_node->field_disorder_phenotype['und'][$pheno_count]['target_id'] = $disorder_pheno_nid;
                $pheno_count++;
            }

            node_save($disorder_node);
        }
    }

    private function create_frequency($disorder_sign_freq) {
        if (array_key_exists((string) $disorder_sign_freq['id'], $this->sign_freq_list)) {
            return $this->sign_freq_list[(string) $disorder_sign_freq['id']];
        }

        $sign_freq_node = new stdClass();
        $sign_freq_node->type = 'sign_frequency';
        $sign_freq_node->language = 'und';
        $sign_freq_node->uid = 1;
        $sign_freq_node->title = $disorder_sign_freq->Name;

        $sign_freq_node->field_signfreq_name['und'][0]['value'] = $disorder_sign_freq->Name;
        $sign_freq_node->field_signfreq_orphaid['und'][0]['value'] = $disorder_sign_freq['id'];

        node_save($sign_freq_node);
        $this->sign_freq_list[(string) $disorder_sign_freq['id']] = $sign_freq_node->nid;
        return $sign_freq_node->nid;
    }

    private function create_association($disorder_nid, $clinical_sign_nid, $sign_freq_nid) {
        $dis_sign_node = new stdClass();
        $dis_sign_node->type = 'disorder_sign';
        $dis_sign_node->language = 'und';
        $dis_sign_node->uid = 1;
        $dis_sign_node->title = 'DIS_SIGN';

        $dis_sign_node->field_ds_sign['und'][0]['target_id'] = $clinical_sign_nid;
        $dis_sign_node->field_ds_disorder['und'][0]['target_id'] = $disorder_nid;
        $dis_sign_node->field_ds_frequency['und'][0]['target_id'] = $sign_freq_nid;

        node_save($dis_sign_node);
        return $dis_sign_node->nid;
    }
} 