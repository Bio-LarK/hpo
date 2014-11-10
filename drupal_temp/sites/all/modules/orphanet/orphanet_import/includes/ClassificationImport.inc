<?php
/**
 * Created by PhpStorm.
 * User: uqtgroza
 * Date: 4/08/14
 * Time: 8:32 PM
 */

class ClassificationImport {

    private $file_list = array();
    private $classification_folder;

    private $expert_list = array();
    private $disorder_list = array();

    public function __construct($classification_folder) {
        $this->classification_folder = $classification_folder;

        $this->expert_list = $this->retrieve('expert', 'field_expert_orphaid');
        $this->disorder_list = $this->retrieve('disorder', 'field_disorder_orphaid');
    }

    public function __destruct() {
    }

    public function loadClassifications() {
        $this->file_list = scandir($this->classification_folder);

        $count = 0;
        foreach($this->file_list as $file) {
            if (($file !== '.') && ($file != '..')) {
                if (substr($this->classification_folder, -1) !== '/') {
                    $this->process_file($this->classification_folder . '/' . $file);
                } else {
                    $this->process_file($this->classification_folder . $file);
                }

                drupal_set_message('Loaded classification from: ' . $file, 'status');
                $count++;
            }
        }

        drupal_set_message('Total classifications loaded: ' . $count, 'status');

        /*
        $file = 'en_product3_146.xml';
        if (substr($this->classification_folder, -1) !== '/') {
            $this->process_file($this->classification_folder . '/' . $file);
        } else {
            $this->process_file($this->classification_folder . $file);
        }
        */
    }

    private function process_file($file) {
        $classification_data = simplexml_load_file($file);
        $disorder_nid = $this->create_disorder($classification_data->DisorderList[0]->Disorder, -1);

        $class_node = $classification_data->DisorderList[0]->Disorder->ClassificationNodeList[0]->ClassificationNode;
        $this->add_children($disorder_nid, $class_node);
    }

    private function add_children($disorder_nid, $class_node) {
        $disorder_node = node_load($disorder_nid);

        foreach($class_node->ClassificationNodeChildList[0] as $classification_child) {
            $dis_xml_nid = $this->create_disorder($classification_child->Disorder, $disorder_nid);

            $current_count = 0;
            if (array_key_exists('und', $disorder_node->field_disorder_child)) {
                $current_count = sizeof($disorder_node->field_disorder_child['und']);
            }

            if ($current_count != 0) {
                $found = false;
                for ($i = 0; $i < $current_count; $i++) {
                    if ($disorder_node->field_disorder_child['und'][$i]['target_id'] == $dis_xml_nid) {
                        $found = true;
                    }
                }

                if (!$found) {
                    $disorder_node->field_disorder_child['und'][$current_count]['target_id'] = $dis_xml_nid;
                }
            } else {
                $disorder_node->field_disorder_child['und'][0]['target_id'] = $dis_xml_nid;
            }

            $this->add_children($dis_xml_nid, $classification_child);
        }
        node_save($disorder_node);
    }

    private function create_disorder($disorder, $parent_nid) {
        $id = $disorder['id'];

        if (array_key_exists((string) $id, $this->disorder_list)) {
            if ($parent_nid != -1) {
                $this->add_parent($this->disorder_list[(string) $id], $parent_nid);
            }
            return $this->disorder_list[(string) $id];
        }

        $name = $disorder->Name;
        if ($name == '') {
            $name = '_NO_NAME_';
        }

        $disorder_node = new stdClass();
        $disorder_node->type = 'disorder';
        $disorder_node->language = 'und';
        $disorder_node->uid = 1;
        $disorder_node->title = $name;

        $disorder_node->field_disorder_name['und'][0]['value'] = $name;
        $disorder_node->field_disorder_orphaid['und'][0]['value'] = $id;
        $disorder_node->field_disorder_orphanumber['und'][0]['value'] = $disorder->OrphaNumber;

        $expert_nid = $this->create_expert($disorder->ExpertLink);
        if ($expert_nid != -1) {
            $disorder_node->field_disorder_expert['und'][0]['target_id'] = $expert_nid;
        }

        if ($parent_nid != -1) {
            $disorder_node->field_disorder_parent['und'][0]['target_id'] = $parent_nid;
        }

        node_save($disorder_node);
        return $disorder_node->nid;

//        return $id;
    }

    private function add_parent($disoder_nid, $parent_nid) {
        $disorder_node = node_load($disoder_nid);

        $current_count = 0;
        if (array_key_exists('und', $disorder_node->field_disorder_parent)) {
            $current_count = sizeof($disorder_node->field_disorder_parent['und']);
        }

        if ($current_count != 0) {
            $found = false;
            for ($i = 0; $i < $current_count; $i++) {
                if ($disorder_node->field_disorder_parent['und'][$i]['target_id'] == $parent_nid) {
                    $found = true;
                }
            }

            if (!$found) {
                $disorder_node->field_disorder_parent['und'][$current_count]['target_id'] = $parent_nid;
            }
        } else {
            $disorder_node->field_disorder_parent['und'][0]['target_id'] = $parent_nid;
        }

        node_save($disorder_node);
    }

    private function create_expert($expert_link) {
        $expert_id = -1;

        $index = strrpos($expert_link, '=');
        if ($index !== false) {
            $expert_id = intval(substr($expert_link, $index + 1));
        } else {
            return $expert_id;
        }

        if (array_key_exists((string) $expert_id, $this->expert_list)) {
            return $this->expert_list[(string) $expert_id];
        }

        $expert_node = new stdClass();
        $expert_node->type = 'expert';
        $expert_node->language = 'und';
        $expert_node->uid = 1;

        $expert_node->title = 'Expert::' . $expert_id;
        $expert_node->field_expert_orphaid['und'][0]['value'] = $expert_id;
        $expert_node->field_expert_link['und'][0]['value'] = $expert_link;

        node_save($expert_node);
        $this->expert_list[(string) $expert_id] = $expert_node->nid;
        return $expert_node->nid;

//        return $expert_id;
    }

    private function retrieve($node_type, $field_name) {
        $sql = 'SELECT nid FROM {node} n WHERE n.type = :type';
        $result = db_query($sql, array(':type' => $node_type));

        $result_array = array();
        foreach ($result as $row) {
            $node = node_load($row->nid);
            $result_array[(string) $node->{$field_name}['und'][0]['value']] = $row->nid;
        }

        return $result_array;
    }

} 