<?php

class DisorderImport {

    private $disorder_data;
    private $disorder_epidem_data;

    private $disorder_list = array();
    private $external_references = array();
    private $experts = array();

    private $prevalence_list = array();
    private $age_of_onset_list = array();
    private $age_of_death_list = array();
    private $type_of_inheritance_list = array();

    public function __construct($disorders_file, $disorders_epidem_file) {
        $this->disorder_data = simplexml_load_file($disorders_file);
        $this->disorder_epidem_data = simplexml_load_file($disorders_epidem_file);
    }

    public function __destruct() {
        unset($this->disorder_data);
    }

    public function get_disorders() {
        return $this->disorder_list;
    }

    public function load_data() {
        foreach($this->disorder_data->DisorderList[0] as $disorder) {
            $disorder_id = $disorder['id'];
            if (!array_key_exists((string) $disorder_id, $this->disorder_list)) {
                $nid = $this->create_disorder($disorder);
                $this->disorder_list[(string) $disorder_id] = $nid;
            }
        }

        foreach($this->disorder_epidem_data->DisorderList[0] as $disorder) {
            $disorder_id = $disorder['id'];
            if (array_key_exists((string) $disorder_id, $this->disorder_list)) {
                $disorder_nid = $this->disorder_list[(string) $disorder_id];

                $this->add_epidem_data($disorder_nid, $disorder);
            }
        }
    }

    private function create_disorder($disorder) {
        $name = $disorder->Name;
        if ($name == '') {
            $name = '_NO_NAME_';
        }
        $id = $disorder['id'];

        $disorder_node = new stdClass();
        $disorder_node->type = 'disorder';
        $disorder_node->language = 'und';
        $disorder_node->uid = 1;
        $disorder_node->title = $name;

        $disorder_node->field_disorder_name['und'][0]['value'] = $name;
        $disorder_node->field_disorder_orphaid['und'][0]['value'] = $id;
        $disorder_node->field_disorder_orphanumber['und'][0]['value'] = $disorder->OrphaNumber;

        $count = 0;
        foreach($disorder->SynonymList[0] as $synonym) {
            $disorder_node->field_disorder_synonym['und'][$count]['value'] = $synonym;
            $count++;
        }

        $count = 0;
        foreach($disorder->ExternalReferenceList[0] as $external_reference) {
            $er_nid = $this->create_external_reference($external_reference);
            $disorder_node->field_disorder_er['und'][$count]['target_id'] = $er_nid;
            $count++;
        }

        $expert_nid = $this->create_expert($disorder->ExpertLink);
        if ($expert_nid != -1) {
            $disorder_node->field_disorder_expert['und'][0]['target_id'] = $expert_nid;
        }

        node_save($disorder_node);
        return $disorder_node->nid;

//        return $id;
    }

    private function create_external_reference($external_reference) {
        if (array_key_exists((string) $external_reference['id'], $this->external_references)) {
            return $this->external_references[(string) $external_reference['id']];
        }

        $source = $external_reference->Source;
        $reference = $external_reference->Reference;

        $er_node = new stdClass();
        $er_node->type = 'external_reference';
        $er_node->language = 'und';
        $er_node->uid = 1;
        $er_node->title = $source . '::' . $reference;
        $er_node->field_er_orphaid['und'][0]['value'] = $external_reference['id'];
        $er_node->field_er_source['und'][0]['value'] = $source;
        $er_node->field_er_reference['und'][0]['value'] = $reference;

        node_save($er_node);
        $this->external_references[(string) $external_reference['id']] = $er_node->nid;
        return $er_node->nid;

//        $this->external_references[(string) $external_reference['id']] = $external_reference['id'];
//        return $external_reference['id'];
    }

    private function create_expert($expert_link) {
        $expert_id = -1;

        $index = strrpos($expert_link, '=');
        if ($index !== false) {
            $expert_id = intval(substr($expert_link, $index + 1));
        } else {
            return $expert_id;
        }

        if (array_key_exists((string) $expert_id, $this->experts)) {
            return $this->experts[(string) $expert_id];
        }

        $expert_node = new stdClass();
        $expert_node->type = 'expert';
        $expert_node->language = 'und';
        $expert_node->uid = 1;

        $expert_node->title = 'Expert::' . $expert_id;
        $expert_node->field_expert_orphaid['und'][0]['value'] = $expert_id;
        $expert_node->field_expert_link['und'][0]['value'] = $expert_link;

        node_save($expert_node);
        $this->experts[(string) $expert_id] = $expert_node->nid;
        return $expert_node->nid;

//        $this->experts[(string) $expert_id] = $expert_id;
//        return $expert_id;
    }

    private function add_epidem_data($disorder_nid, $disorder) {
        $disorder_node = node_load($disorder_nid);
        $prevalence_nid = $this->create_prevalence($disorder);
        if ($prevalence_nid != -1) {
            $disorder_node->field_disorder_prevalence['und'][0]['target_id'] = $prevalence_nid;
        }

        $age_of_onset_nid = $this->create_age_of_onset($disorder);
        if ($age_of_onset_nid != -1) {
            $disorder_node->field_disorder_onset['und'][0]['target_id'] = $age_of_onset_nid;
        }

        $age_of_death_nid = $this->create_age_of_death($disorder);
        if ($age_of_death_nid != -1) {
            $disorder_node->field_disorder_death['und'][0]['target_id'] = $age_of_death_nid;
        }

        $count = 0;
        foreach($disorder->TypeOfInheritanceList[0] as $type_of_inheritance) {
            $inheritance_nid = $this->create_type_of_inheritance($type_of_inheritance);
            if ($inheritance_nid != -1) {
                $disorder_node->field_disorder_inheritance['und'][$count]['target_id'] = $inheritance_nid;
                $count++;
            }
        }

        node_save($disorder_node);
    }

    private function create_prevalence($disorder) {
        $prevalence_id = $disorder->ClassOfPrevalence['id'];
        if ($prevalence_id == '') {
            return -1;
        }

        if (array_key_exists((string) $prevalence_id, $this->prevalence_list)) {
            return $this->prevalence_list[(string) $prevalence_id];
        }

        $prevalence_node = new stdClass();
        $prevalence_node->type = 'prevalence_class';
        $prevalence_node->language = 'und';
        $prevalence_node->uid = 1;

        $prevalence_node->title = $disorder->ClassOfPrevalence->Name;
        $prevalence_node->field_prevalence_orphaid['und'][0]['value'] = $prevalence_id;
        $prevalence_node->field_prevalence_name['und'][0]['value'] = $disorder->ClassOfPrevalence->Name;

        node_save($prevalence_node);
        $this->prevalence_list[(string) $prevalence_id] = $prevalence_node->nid;
        return $prevalence_node->nid;
    }

    private function create_age_of_onset($disorder) {
        $age_of_onset_id = $disorder->AverageAgeOfOnset['id'];
        if ($age_of_onset_id == '') {
            return -1;
        }

        if (array_key_exists((string) $age_of_onset_id, $this->age_of_onset_list)) {
            return $this->age_of_onset_list[(string) $age_of_onset_id];
        }

        $age_of_onset_node = new stdClass();
        $age_of_onset_node->type = 'age_of_onset';
        $age_of_onset_node->language = 'und';
        $age_of_onset_node->uid = 1;

        $age_of_onset_node->title = $disorder->AverageAgeOfOnset->Name;
        $age_of_onset_node->field_aoo_orphaid['und'][0]['value'] = $age_of_onset_id;
        $age_of_onset_node->field_aoo_name['und'][0]['value'] = $disorder->AverageAgeOfOnset->Name;

        node_save($age_of_onset_node);
        $this->age_of_onset_list[(string) $age_of_onset_id] = $age_of_onset_node->nid;
        return $age_of_onset_node->nid;
    }

    private function create_age_of_death($disorder) {
        $age_of_death_id = $disorder->AverageAgeOfDeath['id'];
        if ($age_of_death_id == '') {
            return -1;
        }

        if (array_key_exists((string) $age_of_death_id, $this->age_of_death_list)) {
            return $this->age_of_death_list[(string) $age_of_death_id];
        }

        $age_of_death_node = new stdClass();
        $age_of_death_node->type = 'age_of_death';
        $age_of_death_node->language = 'und';
        $age_of_death_node->uid = 1;

        $age_of_death_node->title = $disorder->AverageAgeOfDeath->Name;
        $age_of_death_node->field_aod_orphaid['und'][0]['value'] = $age_of_death_id;
        $age_of_death_node->field_aod_name['und'][0]['value'] = $disorder->AverageAgeOfDeath->Name;

        node_save($age_of_death_node);
        $this->age_of_death_list[(string) $age_of_death_id] = $age_of_death_node->nid;
        return $age_of_death_node->nid;
    }

    private function create_type_of_inheritance($type_of_inheritance) {
        $inheritance_id = $type_of_inheritance['id'];
        if ($inheritance_id == '') {
            return -1;
        }

        if (array_key_exists((string) $inheritance_id, $this->type_of_inheritance_list)) {
            return $this->type_of_inheritance_list[(string) $inheritance_id];
        }

        $inheritance_node = new stdClass();
        $inheritance_node->type = 'type_of_inheritance';
        $inheritance_node->language = 'und';
        $inheritance_node->uid = 1;

        $inheritance_node->title = $type_of_inheritance->Name;
        $inheritance_node->field_toi_orphaid['und'][0]['value'] = $inheritance_id;
        $inheritance_node->field_toi_name['und'][0]['value'] = $type_of_inheritance->Name;

        node_save($inheritance_node);
        $this->type_of_inheritance_list[(string) $inheritance_id] = $inheritance_node->nid;
        return $inheritance_node->nid;
    }

}