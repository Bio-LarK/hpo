<?php

class GeneImport {

    private $gene_data;

    private $gene_list = array();
    private $external_references = array();
    private $dga_type_list = array();
    private $dga_status_list = array();

    public function __construct($genes_file) {
        $this->gene_data = simplexml_load_file($genes_file);
    }

    public function __destruct() {
        unset($this->gene_data);
    }

    public function get_gene_list() {
        return $this->gene_list;
    }

    public function get_external_references() {
        return $this->external_references;
    }

    public function load_data() {
        foreach($this->gene_data->DisorderList[0] as $disorder) {
            $this->parse_disorder($disorder);
        }
    }

    private function parse_disorder($disorder) {
        foreach($disorder->DisorderGeneAssociationList[0] as $dga) {

            $gene_id = $dga->Gene['id'];
            if (!array_key_exists((string) $gene_id, $this->gene_list)) {
                $nid = $this->create_gene($dga->Gene);
                $this->gene_list[(string) $gene_id] = $nid;
            }

        }
    }

    public function map_disorders($disorder_list) {
        foreach($this->gene_data->DisorderList[0] as $disorder) {
            $disorder_id = $disorder['id'];
            $disorder_nid = $disorder_list[(string) $disorder_id];
            $this->map_disorder($disorder_nid, $disorder);
        }
    }

    private function map_disorder($disorder_nid, $disorder) {
        $disorder_node = node_load($disorder_nid);

        $dis_count = 0;
        foreach($disorder->DisorderGeneAssociationList[0] as $dga) {
            $gene = $dga->Gene;
            $gene_nid = $this->gene_list[(string) $gene['id']];
            $gene_node = node_load($gene_nid);

            $dga_t = $dga->DisorderGeneAssociationType;
            $dga_t_nid = $this->dis_gene_type($dga_t);

            $dga_s = $dga->DisorderGeneAssociationStatus;
            $dga_s_nid = $this->dis_gene_status($dga_s);

            $disorder_gene_nid = $this->create_mapping($disorder_node->nid, $gene_nid, $dga_t_nid, $dga_s_nid);

            $current_count = 0;
            if (array_key_exists('und', $gene_node->field_gene_disgene)) {
                $current_count = sizeof($gene_node->field_gene_disgene['und']);
            }
            $gene_node->field_gene_disgene['und'][$current_count]['target_id'] = $disorder_gene_nid;
            node_save($gene_node);

            $disorder_node->field_disorder_disgene['und'][$dis_count]['target_id'] = $disorder_gene_nid;
            $dis_count++;
        }

        node_save($disorder_node);
    }

    private function dis_gene_type($dga_t) {
        if (array_key_exists((string) $dga_t['id'], $this->dga_type_list)) {
            return $this->dga_type_list[(string) $dga_t['id']];
        }

        $dgt_node = new stdClass();
        $dgt_node->type = 'disorder_gene_at';
        $dgt_node->language = 'und';
        $dgt_node->uid = 1;
        $dgt_node->title = $dga_t->Name;

        $dgt_node->field_dgt_name['und'][0]['value'] = $dga_t->Name;
        $dgt_node->field_dgt_orphaid['und'][0]['value'] = $dga_t['id'];

        node_save($dgt_node);
        $this->dga_type_list[(string) $dga_t['id']] = $dgt_node->nid;
        return $dgt_node->nid;
    }

    private function dis_gene_status($dga_s) {
        if (array_key_exists((string) $dga_s['id'], $this->dga_status_list)) {
            return $this->dga_status_list[(string) $dga_s['id']];
        }

        $dgs_node = new stdClass();
        $dgs_node->type = 'disorder_gene_as';
        $dgs_node->language = 'und';
        $dgs_node->uid = 1;
        $dgs_node->title = $dga_s->Name;

        $dgs_node->field_dga_name['und'][0]['value'] = $dga_s->Name;
        $dgs_node->field_dga_orphaid['und'][0]['value'] = $dga_s['id'];

        node_save($dgs_node);
        $this->dga_status_list[(string) $dga_s['id']] = $dgs_node->nid;
        return $dgs_node->nid;
    }

    private function create_mapping($disorder_nid, $gene_nid, $dga_t_nid, $dga_s_nid) {
        $dis_gene_node = new stdClass();
        $dis_gene_node->type = 'disorder_gene';
        $dis_gene_node->language = 'und';
        $dis_gene_node->uid = 1;
        $dis_gene_node->title = 'DIS_GENE';

        $dis_gene_node->field_disgene_gene['und'][0]['target_id'] = $gene_nid;
        $dis_gene_node->field_disgene_disorder['und'][0]['target_id'] = $disorder_nid;
        $dis_gene_node->field_disgene_as['und'][0]['target_id'] = $dga_s_nid;
        $dis_gene_node->field_disgene_at['und'][0]['target_id'] = $dga_t_nid;

        node_save($dis_gene_node);
        return $dis_gene_node->nid;
    }

    private function create_gene($gene) {
        $name = $gene->Name;
        if ($name == '') {
            $name = '_NO_NAME_';
        }
        $id = $gene['id'];

        $gene_node = new stdClass();
        $gene_node->type = 'gene';
        $gene_node->language = 'und';
        $gene_node->uid = 1;
        $gene_node->title = $name;
        $gene_node->field_gene_name['und'][0]['value'] = $name;
        $gene_node->field_gene_orphaid['und'][0]['value'] = $id;
        $gene_node->field_gene_orphanumber['und'][0]['value'] = $gene->OrphaNumber;
        $gene_node->field_gene_symbol['und'][0]['value'] = $gene->Symbol;

        $count = 0;
        foreach($gene->SynonymList[0] as $synonym) {
            $gene_node->field_gene_synonym['und'][$count]['value'] = $synonym;
            $count++;
        }

        $count = 0;
        foreach($gene->ExternalReferenceList[0] as $external_reference) {
            $er_nid = $this->create_external_reference($external_reference);
            $gene_node->field_gene_er['und'][$count]['target_id'] = $er_nid;
            $count++;
        }

        node_save($gene_node);
        return $gene_node->nid;

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

//        $this->external_references[(string) $external_reference['id']] = $external_reference['id'];


        node_save($er_node);
        $this->external_references[(string) $external_reference['id']] = $er_node->nid;
        return $er_node->nid;

//        return $external_reference['id'];
    }
} 