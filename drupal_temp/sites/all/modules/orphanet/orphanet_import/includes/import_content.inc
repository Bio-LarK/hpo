<?php

//function import_content($pheno_vocab_file, $disorders_file, $disorders_epidem_file, $genes_file, $disorders_pheno_file) {
function import_content($pheno_vocab_file) {
    $pheno_list = array();

    $pheno_vocab_data = simplexml_load_file($pheno_vocab_file);
    foreach($pheno_vocab_data->ClinicalSignList[0] as $clinical_sign) {
        $nid = parse_clinical_sign($clinical_sign);
        $pheno_list[(string) $clinical_sign['id']] = $nid;
    }
    drupal_set_message(sizeof($pheno_list), 'status');

}

function parse_clinical_sign($clinical_sign) {
    $name = $clinical_sign->Name;
    if ($name === '') {
        $name = '_NO_NAME_';
    }
    $id = $clinical_sign['id'];

    $sign_node = new stdClass();
    $sign_node->type = 'clinical_sign';
    $sign_node->language = 'und';
    $sign_node->uid = 1;
    $sign_node->title = $name;
    $sign_node->field_sign_name['und'][0] = $name;
    $sign_node->field_sign_orphaid['und'][0] = $id;

    node_save($sign_node);
    return $sign_node->nid;
}
