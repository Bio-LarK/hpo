"use strict";angular.module("hpoApp",["ngAnimate","ngCookies","ngResource","ngSanitize","ngTouch","ui.router","config","dotjem.angular.tree","ui.bootstrap","ajoslin.promise-tracker","toaster","monospaced.elastic","textAngular","ui.select"]).run(["$state","$stateParams","$rootScope","searchService","pageService",function(a,b,c,d,e){c.$state=a,c.$stateParams=b,c.searchService=d,c.pageService=e}]).config(["$stateProvider","$urlRouterProvider","uiSelectConfig",function(a,b,c){c.theme="bootstrap",b.otherwise("/phenotypes"),a.state("suggestions",{url:"/suggestions",controller:"SuggestionsCtrl as vm",templateUrl:"views/suggestions.html"}).state("suggestion",{url:"/suggestions/:suggestionId",controller:"SuggestionCtrl as vm",templateUrl:"views/suggestion.html"}).state("phenotype",{url:"/phenotypes/:phenotypeId",controller:"PhenotypeCtrl",templateUrl:"views/phenotype.html"}).state("phenotype.edit",{url:"/edit"}).state("phenotypes",{url:"/phenotypes",controller:"PhenotypesCtrl",templateUrl:"views/phenotypes.html"})}]),angular.module("hpoApp").controller("MainCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("hpoApp").controller("PhenotypesCtrl",["$scope","Phenotype","promiseTracker","pageService",function(a,b,c,d){function e(){d.setTitle("Phenotypes");var b=g(a.page++);a.loadingTracker.addPromise(b)}function f(){var b=g(a.page++);a.loadingTracker.addPromise(b)}function g(c){return b.query({fields:"nid,concept_label",page:c},function(b){a.phenotypes=a.phenotypes||[],a.phenotypes=a.phenotypes.concat(b)})}a.loadMore=f,a.loadingTracker=c(),a.page=0,e(),console.log("phenotypes ctrl")}]),angular.module("hpoApp").factory("Phenotype",["$resource","$q","$http","ENV","Synonym",function(a,b,c,d,e){function f(a){return a.body="An HPO summary for this concept is currently under development.",a.concept_parent=_.map(a.concept_parent,function(a){return new h(a)}),a.concept_synonym=_.map(a.concept_synonym,function(a){return new e(a)}),a}function g(){var a=this,c=_.map(this.concept_parent,function(a){return a.id||a.nid});if(!c||!c.length)return b.when([]);var d=_.indexBy(c,function(a,b){return"parameters[nid]["+b+"]"});return d.fields=["nid","concept_label","concept_parent"].join(","),h.query(d).$promise.then(function(b){a.concept_parent=b})}console.log("ENV",d);var h=a(d.apiEndpoint+"/entity_node/:nid",{"parameters[type]":"hpo_concept",nid:"@nid"},{get:{method:"GET",transformResponse:c.defaults.transformResponse.concat([f])}});return h.prototype.getParents=g,h}]),angular.module("hpoApp").filter("inSlicesOf",["$rootScope",function(a){console.log("staring in slice of!!");var b=function(b,c){if(c||(c=3),!angular.isArray(b)&&!angular.isString(b))return b;for(var d=[],e=0;e<b.length;e++){var f=parseInt(e/c,10),g=e%c===0;g&&(d[f]=[]),d[f].push(b[e])}a.arraysinSliceOf=a.arraysinSliceOf||[];var h=null;return angular.forEach(a.arraysinSliceOf,function(a){angular.equals(a,d)&&(h=a)}),h?(console.log("no change"),h):(console.log("change"),a.arraysinSliceOf.push(d),d)};return b}]),angular.module("hpoApp").controller("PhenotypeCtrl",["$scope","$stateParams","promiseTracker","Phenotype","pageService","$state","modalService","$log",function(a,b,c,d,e,f,g,h){function i(){e.setTitle("Loading...");var c=d.get({nid:b.phenotypeId},function(a){p.phenotype=a,e.setTitle(a.concept_label),h.debug(p.phenotype)}).$promise;a.loadingTracker.addPromise(c)}function j(a){p.isEditing=a,a?f.go("phenotype.edit"):(console.log("go to phentoype"),f.go("phenotype"))}function k(a){a.isShowingParents=!a.isShowingParents,a.isShowingParents&&a.getParents()}function l(){return g.openEditClassification(p.phenotype)}function m(){return g.openEditTitle(p.phenotype)}function n(){return g.openEditDescription(p.phenotype)}function o(a){return g.openEditSynonym(p.phenotype,a)}var p=a;p.loadingTracker=c(),p.phenotype=null,p.toggleParents=k,p.isEditing=!0,p.editBody=n,p.editTitle=m,p.editClassification=l,p.changeEditing=j,p.editSynonym=o,i()}]),angular.module("hpoApp").controller("SuggestionCtrl",["$stateParams","TransactionRequest","$state","$http","toaster","ENV","$log",function(a,b,c,d,e,f,g){function h(){j().then(function(){return i()})}function i(){return b.get({nid:a.suggestionId}).$promise.then(function(a){m.suggestion=a,m.isOpen=m.suggestion.$tr_status.nid===_.find(m.statues,{title:"Submitted"}).nid,_.each(a.$tr_trans,function(b){b.loadReferences().then(function(b){a.$relatedNodes||(a.$relatedNodes=b.relatedNodes)})})})}function j(){return d.get(f.apiEndpoint+"/entity_node?parameters[type]=tr_status").then(function(a){m.statues=a.data})}function k(a){var b=_.find(m.statues,{title:"Accepted"});return b?(a.tr_status=b.nid,void a.$update().then(function(){e.pop("success","Suggestion Accepted"),c.go("suggestions")})):void g.error("Couldnt find accept status")}function l(a){var b=_.find(m.statues,{title:"Rejected"});return b?(a.tr_status=b.nid,void a.$update().then(function(){e.pop("success","Suggestion Rejected"),c.go("suggestions")})):void g.error("Couldnt find accept status")}var m=this;m.suggestion=null,m.accept=k,m.reject=l,m.statues=null,m.isOpen=!1,h()}]),angular.module("hpoApp").controller("SuggestionsCtrl",["$http","$scope","ENV","TransactionRequest","$log","$q",function(a,b,c,d,e,f){function g(){h().then(function(){i().then(function(a){m.openSuggestions=a,m.suggestions=m.openSuggestions}),j().then(function(a){m.closedSuggestions=a})})}function h(){return a.get(c.apiEndpoint+"/entity_node?parameters[type]=tr_status").then(function(a){m.statuses=a.data,e.debug("loading statuses",m.statuses)})}function i(){var a=_.find(m.statuses,{title:"Submitted"});return k(a.nid)}function j(){e.debug("statuses",m.statuses);var a=_.find(m.statuses,{title:"Rejected"}),b=_.find(m.statuses,{title:"Accepted"});return f.all([k(a.nid),k(b.nid)]).then(function(a){return _.flatten(a)})}function k(a){return d.query({"parameters[tr_status]":a,fields:"nid,title,tr_status,tr_timestamp,tr_user,tr_trans,created,author,changed"}).$promise.then(function(a){return a},function(){return[]})}function l(a){m.suggestions=null,m.suggestions=a?m.openSuggestions:m.closedSuggestions}var m=this;m.suggestions=null,m.openSuggestions=null,m.closedSuggestions=null,m.isShowingOpen=!0,m.statuses=null,m.suggestionTypeChanged=l,g()}]),angular.module("hpoApp").factory("Synonym",["$resource","ENV","$http","$log",function(a,b,c,d){function e(){var a=this;return d.debug("synonymn",a),c.get(b.apiEndpoint+"/entity_node/"+a.synonym_type.id).then(function(b){return a.synonym_type=b.data,a})}console.log("ENV",b);var f=a(b.apiEndpoint+"/entity_node/:nid",{"parameters[type]":"hpo_synonym",nid:"@nid"});return f.prototype.loadType=e,f}]),angular.module("hpoApp").factory("searchService",["ENV","$http","$state",function(a,b,c){function d(c){var d=encodeURIComponent(c),e=a.apiEndpoint+"/search_node/retrieve.json?keys="+d+"&simple=1";return b.get(e).then(function(a){return a.data})}function e(a){var b={phenotypeId:a.node};c.go("phenotype",b)}var f={getResults:d,changed:e};return f}]),angular.module("hpoApp").factory("pageService",function(){function a(a){b.title=a+" - HPO"}var b={title:null,setTitle:a};return b}),angular.module("hpoApp").factory("ListTransaction",["$resource","ENV","$http","$q",function(a,b,c,d){function e(){var a=this;return a.title="Loading...",a.isRefChange=a.ltrans_svalref?!0:!1,d.all([f(a),g(a),h(a)]).then(function(){return a.title=a.ltrans_onnode.title,a.relatedNodes=[a.ltrans_onnode],"disorder_gene"===a.ltrans_onnode.type?(a.title="Relationship between "+a.ltrans_onnode.disgene_disorder.title+" and "+a.ltrans_onnode.disgene_gene.title,a.relatedNodes=[a.ltrans_onnode.disgene_disorder,a.ltrans_onnode.disgene_gene]):"disorder_sign"===a.ltrans_onnode.type&&(a.title="Relationship between "+a.ltrans_onnode.ds_disorder.title+" and "+a.ltrans_onnode.ds_sign.title,a.relatedNodes=[a.ltrans_onnode.ds_disorder,a.ltrans_onnode.ds_sign]),a})}function f(a){var d=a.ltrans_onnode,e={fields:"nid,title,type,disgene_disorder,disgene_gene,ds_sign,ds_disorder"};return c.get(b.apiEndpoint+"/entity_node/"+d,{params:e}).then(function(b){a.ltrans_onnode=b.data})}function g(a){var e=a.ltrans_svalref;if(!e)return d.when(!1);var f={fields:"nid,title"};return c.get(b.apiEndpoint+"/entity_node/"+e,{params:f}).then(function(b){a.ltrans_svalref=b.data})}function h(a){var e=a.ltrans_cvalref;if(!e)return d.when(!1);var f={fields:"nid,title"};return c.get(b.apiEndpoint+"/entity_node/"+e,{params:f}).then(function(b){a.ltrans_cvalref=b.data})}var i=a(b.apiEndpoint+"/entity_node/:nid",{"parameters[type]":"list_transaction",nid:"@nid"});return i.prototype.loadReferences=e,i}]),angular.module("hpoApp").factory("TransactionRequest",["$resource","$http","ENV","ListTransaction",function(a,b,c,d){function e(a){return a.$tr_trans=_.map(a.tr_trans,function(a){return new d(a)}),delete a.tr_trans,a.$tr_user=a.tr_user,delete a.tr_user,a.$tr_status=a.tr_status,delete a.tr_status,a.$author=a.author,delete a.author,a.$source=a.source,delete a.source,a}var f=a(c.apiEndpoint+"/entity_node/:nid",{"parameters[type]":"transaction_request",nid:"@nid"},{get:{method:"GET",transformResponse:b.defaults.transformResponse.concat([e])},update:{method:"PUT"}});return f}]),angular.module("hpoApp").factory("modalService",["$modal",function(a){function b(b,c){var d={synonym:c,phenotype:b};return a.open({templateUrl:"views/editsynonym.modal.html",controller:"EditSynonymCtrl as vm",resolve:{config:function(){return d}}})}function c(b){var c={concept:b,propertyName:"title",propertyLabel:"Disorder Name"};return a.open({templateUrl:"views/edittitle.modal.html",controller:"EditTitleCtrl as vm",resolve:{config:function(){return c}}})}function d(b){var c={concept:b,propertyName:"body",propertyLabel:"Description"};return a.open({templateUrl:"views/editclassification.modal.html",controller:"EditClassificationCtrl as vm",resolve:{config:function(){return c}}})}function e(b){var c={concept:b,propertyName:"body",propertyLabel:"Description"};return a.open({templateUrl:"views/editbody.modal.html",controller:"EditTitleCtrl as vm",resolve:{config:function(){return c}}})}function f(a){return i(a,"Prevalence Class","disorder_prevalence","prevalence_class")}function g(a){return i(a,"Age of Onset","disorder_onset","age_of_onset")}function h(a){return i(a,"Age of Death","disorder_death","age_of_death")}function i(b,c,d,e){var f={concept:b,propertyLabel:c,propertyName:d,propertyContentType:e};return a.open({templateUrl:"views/edit.modal.html",controller:"EditModalCtrl as editVm",resolve:{config:function(){return f}}})}var j={openPrevalenceClassModal:f,openAgeOfOnset:g,openAgeOfDeath:h,openEditTitle:c,openEditDescription:e,openEditClassification:d,openEditSynonym:b};return j}]),angular.module("hpoApp").controller("EditTitleCtrl",["$scope","$http","$modalInstance","ENV","ListTransaction","config","TransactionRequest","$log","toaster",function(a,b,c,d,e,f,g,h,i){function j(){k()}function k(){return b.get(d.apiEndpoint+"/entity_node?parameters[type]=tr_status").then(function(a){n.statuses=a.data,h.debug("loading statuses",n.statuses)})}function l(){var a=_.find(n.statuses,{title:"Submitted"});if(!a)return void h.error("couldnt find submitted status");var b=new e({title:n.concept.title,type:"list_transaction",ltrans_position:0,ltrans_onnode:n.concept.nid,ltrans_onprop:n.propertyName,ltrans_svalplain:n.propertyValue,ltrans_cvalplain:n.concept[n.propertyName].substring(0,500),body:{value:n.reason,summary:n.reason}});b.$save().then(function(){var c=new g({title:n.concept.title+" - "+n.propertyLabel,type:"transaction_request",tr_timestamp:(new Date).getTime()/1e3,tr_trans:[b.nid],tr_status:a.nid,tr_user:0,body:{value:n.reason,summary:n.reason}});return i.pop("success","Suggestion submitted."),c.$save()}),c.close()}function m(){c.dismiss("cancel")}var n=this;n.concept=f.concept,n.propertyName=f.propertyName,n.propertyLabel=f.propertyLabel,n.propertyValue=n.concept[n.propertyName].substring(0,400),n.save=l,n.statuses=null,n.cancel=m,n.reason="",j()}]),angular.module("hpoApp").controller("EditSynonymCtrl",["$scope","$http","$modalInstance","config","ENV","ListTransaction","$q","TransactionRequest","toaster","$log",function(a,b,c,d,e,f,g,h,i,j){function k(){l()}function l(){return b.get(e.apiEndpoint+"/entity_node?parameters[type]=tr_status").then(function(a){o.statuses=a.data,j.debug("loading statuses",o.statuses)})}function m(){j.debug("savuing!");var a=_.find(o.statuses,{title:"Submitted"});if(!a)return void j.error("couldnt find submitted status");var b=new f({title:o.phenotype.title,type:"list_transaction",ltrans_position:0,ltrans_onnode:o.synonym.nid,ltrans_onprop:"title",ltrans_svalplain:o.synonymName,ltrans_cvalplain:o.synonym.title.substring(0,500),body:{value:o.reason,summary:o.reason}});b.$save().then(function(){var c=new h({title:o.phenotype.title+" - Synonym",type:"transaction_request",tr_timestamp:(new Date).getTime()/1e3,tr_trans:[b.nid],tr_status:a.nid,tr_user:0,body:{value:o.reason,summary:o.reason}});return i.pop("success","Suggestion submitted."),c.$save()}),c.close()}function n(){c.dismiss("cancel")}var o=this;o.synonym=d.synonym,o.phenotype=d.phenotype,o.reason=null,o.types=null,o.synonymName=o.synonym.title,o.cancel=n,o.save=m,k()}]),angular.module("hpoApp").factory("ListTransactionUnlimited",["$resource","ENV",function(a,b){var c=a(b.apiEndpoint+"/entity_node/:nid",{"parameters[type]":"list_transaction_unlimited",nid:"@nid"});return c}]),angular.module("hpoApp").controller("EditClassificationCtrl",["$scope","$http","config","Phenotype","searchService",function(a,b,c,d){var e=this;e.config=c,e.phenotype=c.concept,e.refreshPhenotypes=refreshPhenotypes,e.newPhenotype={},d.query({fields:"title,nid"}).$promise.then(function(a){e.phenotypes=a})}]);