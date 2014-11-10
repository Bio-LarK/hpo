<?php

require_once('GeneImport.inc');
require_once('PhenoVocabImport.inc');
require_once('DisorderImport.inc');
require_once('DisorderPhenoImport.inc');

class OrphanetImport {

    private $pheno_vocab_import;
    private $gene_import;
    private $disorder_import;

    private $disorder_list;
    private $pheno_list;

    public function __construct($pheno_vocab_file, $genes_file, $disorders_file, $disorders_epidem_file) {
        $this->pheno_vocab_import = new PhenoVocabImport($pheno_vocab_file);
        $this->gene_import = new GeneImport($genes_file);
        $this->disorder_import = new DisorderImport($disorders_file, $disorders_epidem_file);
    }

    public function __destruct() {
    }

    public function load_orphanet() {
        $this->pheno_vocab_import->load_data();
        $this->pheno_list = $this->pheno_vocab_import->get_pheno_list();
        drupal_set_message('Imported ' . sizeof($this->pheno_list) . ' clinical signs.');

        $this->gene_import->load_data();
        $gene_list = $this->gene_import->get_gene_list();
        drupal_set_message('Imported ' . sizeof($gene_list) . ' genes.');

        $this->disorder_import->load_data();
        $this->disorder_list = $this->disorder_import->get_disorders();
        drupal_set_message('Imported ' . sizeof($this->disorder_list) . ' disorders.');

        $this->gene_import->map_disorders($this->disorder_list);
    }

    public function map_disoders_to_pheno($disorders_pheno_file) {
        $disoder_pheno_import = new DisorderPhenoImport($this->disorder_list, $this->pheno_list);
        $disoder_pheno_import->load_data($disorders_pheno_file);
    }
}