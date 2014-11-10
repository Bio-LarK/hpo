<?php
/**
 * Created by PhpStorm.
 * User: uqtgroza
 * Date: 5/08/14
 * Time: 12:10 PM
 */

class TestEntity extends Entity {
    protected function defaultUri() {
        return array('path' => 'test_entity/' . $this->identifier());
    }
}