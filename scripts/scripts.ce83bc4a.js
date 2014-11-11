"use strict";angular.module("orphaApp",["ngAnimate","ngSanitize","ngResource","ui.router","truncate","restangular","ui.bootstrap","dotjem.angular.tree","ui.utils","ajoslin.promise-tracker","angular-loading-bar","xeditable","config","toaster","monospaced.elastic","textAngular","duScroll","sf.treeRepeat","ui.select"]).run(["$rootScope","$http","$state","$stateParams","editableOptions","Page","ENV","siteSearchService","$log",function(a,b,c,d,e,f,g,h){a.$state=c,a.$stateParams=d,a.Page=f,e.theme="bs3",a.siteSearchService=h}]).config(["$stateProvider","$animateProvider","uiSelectConfig","$urlRouterProvider","RestangularProvider","ENV",function(a,b,c,d,e,f){e.setBaseUrl(f.apiEndpoint),c.theme="bootstrap",b.classNameFilter(/^((?!(fa-spin)).)*$/),d.otherwise("/landing"),a.state("home",{url:"/landing",controller:"HomeCtrl as vm",templateUrl:"views/home.html"}).state("classification",{url:"/classification/:classificationId?disorderId",controller:"ClassificationCtrl as vm",templateUrl:"views/classification.html"}).state("landing",{url:"/landing",templateUrl:"views/landing.html"}).state("tour",{url:"/tour",controller:["Page",function(a){a.setTitle("Tour")}],templateUrl:"views/tour.html"}).state("gene",{url:"/gene/:geneId/disorders",controller:"GeneCtrl",templateUrl:"views/gene.html"}).state("genes",{url:"/genes",controller:"GenesCtrl",templateUrl:"views/genes.html"}).state("sign",{url:"/disorder/:signId/concepts",controller:"SignCtrl",templateUrl:"views/sign.html"}).state("signs",{url:"/signs",controller:"SignsCtrl",templateUrl:"views/signs.html"}).state("suggestions",{url:"/suggestions",controller:"SuggestionsCtrl as vm",templateUrl:"views/suggestions.html"}).state("suggestion",{url:"/suggestions/:suggestionId",controller:"SuggestionCtrl as vm",templateUrl:"views/suggestion.html"}).state("disorder",{url:"/concepts/:disorderId",controller:"DisorderCtrl",templateUrl:"views/disorder.html"}).state("disorder.edit",{url:"/edit"}).state("disorders",{url:"/term?page?signId",controller:"DisordersCtrl as vm",templateUrl:"views/disorders.html"}).state("concept",{url:"/concept/:conceptId",controller:function(a,b){var c=b.get({nid:136402},function(){a.disorder=c})},templateUrl:"views/concept.html"})}]),angular.module("orphaApp").controller("MainCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("orphaApp").factory("Concept",["Restangular",function(a){var b=a.service("entity_node");return b}]),angular.module("orphaApp").filter("inSlicesOf",["$rootScope",function(a){var b=function(b,c){if(c||(c=3),!angular.isArray(b)&&!angular.isString(b))return b;for(var d=[],e=0;e<b.length;e++){var f=parseInt(e/c,10),g=e%c===0;g&&(d[f]=[]),d[f].push(b[e])}a.arraysinSliceOf=a.arraysinSliceOf||[];var h=null;return angular.forEach(a.arraysinSliceOf,function(a){angular.equals(a,d)&&(h=a)}),h?h:(a.arraysinSliceOf.push(d),d)};return b}]),angular.module("orphaApp").factory("Disorder",["$resource","$http","$q","RelationshipService","ENV","$log","Classification","disorderBodyService",function(a,b,c,d,e,f,g,h){function i(a){return a.length&&"No entities found."===a[0]?a:(_.each(a,function(a){j(a)}),a)}function j(a){return a.disorder_parent=_.sortBy(a.disorder_parent,"nid"),a.disorder_parent=_.map(a.disorder_parent,function(a){return new x(a)}),a.disorder_child=_.sortBy(a.disorder_child,"nid"),a.disorder_child=_.map(a.disorder_child,function(a){return new x(a)}),a.disorder_class=_.map(a.disorder_class,function(a){return new g(a)}),a.isOpenable=!0,a.body=h.getBody(a),_.each(a.disorder_inheritance,function(a){a.label="Autosomal dominant"===a.toi_name?"AD":"Autosomal recessive"===a.toi_name?"AR":a.toi_name}),a}function k(){return c.when([])}function l(){var a=this,b=["ds_sign","ds_frequency"];return d.getRelatedThroughIntermediary(a,"disorder_phenotype",b)}function m(a,b){var d=_.map(a.disorder_parent,function(a){return a.id||a.nid});if(!d.length)return c.when([]);var e=_.indexBy(d,function(a,b){return"parameters[nid]["+b+"]"});return b&&(e["parameters[disorder_class]"]=b.nid),e.fields=["nid","disorder_name","title","disorder_parent","disorder_class"].join(","),x.query(e).$promise}function n(a){var b=this;return x.getParentsFromDisorderInClassification(b,a).then(function(a){var d=_.map(a,function(a){return a.loadChildren().then(function(){var c=_.findIndex(a.disorder_child,function(a){return a.nid===b.nid});return a.disorder_child.splice(c,1),a.disorder_child.unshift(b),a},function(){return a})});return c.all(d)},function(){return[]})}function o(){var a=this;return x.getParentsFromDisorderInClassification(a).then(function(b){return a.disorder_parent=b,b})}function p(a){var b=this;return b.hasLoadedChildren?c.when(b.disorder_child):q(b,a,0).then(function(a){return b.hasLoadedChildren=!0,b.disorder_child=_.sortBy(a,"nid"),r(b,b.disorder_child),a})}function q(a,b,c){var d={fields:"nid,title,disorder_name,disorder_child,disorder_class","parameters[disorder_parent]":a.nid,page:c};return b&&(d["parameters[disorder_class]"]=b.nid),x.query(d).$promise.then(function(d){return 20!==d.length?d:q(a,b,++c).then(function(a){return d.concat(a)})},function(){return[]})}function r(a,b){var c=!1;_.each(b,function(a){c=c||a.disorder_child.length,_.each(a.disorder_child,function(a){a.isOpenable=!0})}),a.isOpenable=c}function s(){var a=this;if(!a.disorder_er||a.disorder_er.length)return[];var c=_.reduce(a.disorder_er,function(a,b,c){return a["parameters[nid]["+c+"]"]=b.nid,a},{});return c.type="external_reference",c.hello="world",b.get(e.apiEndpoint+"/entity_node",{params:c}).then(function(b){return a.disorder_er=b.data,b.data})}function t(a){return b.get(e.apiEndpoint+"/entity_node/"+a+"/nodes_field_ds_sign?fields=ds_disorder").then(function(a){var b=a.data,c=[];_.each(b,function(a){c.push(a.ds_disorder.nid)}),c=_.uniq(c);var d=_.map(a.data,function(a){return new x(a.ds_disorder)});return d})}function u(a){return b.get(e.apiEndpoint+"/entity_node/"+a+"/nodes_field_disgene_gene?fields=disgene_disorder").then(function(a){var b=_.reduce(a.data,function(a,b,c){return a["parameters[nid]["+c+"]"]=b.disgene_disorder.nid,a},{});return x.query(b).$promise.then(function(a){return a})})}function v(){var a="nid,title,disorder_name,disorder_class",b=x.query({"parameters[disorder_root]":1,fields:a,page:0}).$promise,d=x.query({"parameters[disorder_root]":1,fields:a,page:1}).$promise;return c.all([b,d]).then(function(a){return _.flatten(a)})}function w(a){return x.query({"parameters[disorder_root]":1,"parameters[disorder_class]":a.nid}).$promise.then(function(a){return a.length?a[0]:null})}var x=a(e.apiEndpoint+"/entity_node/:nid",{"parameters[type]":"disorder",nid:"@nid"},{get:{method:"GET",cache:!0,transformResponse:b.defaults.transformResponse.concat([j])},query:{method:"GET",isArray:!0,cache:!0,transformResponse:b.defaults.transformResponse.concat([i])}});return x.prototype.getGenes=k,x.prototype.getSigns=l,x.prototype.getParents=n,x.prototype.loadChildren=p,x.prototype.loadParents=o,x.prototype.loadExternalIdentifiers=s,x.getFromSign=t,x.getFromGene=u,x.getParentsFromDisorderInClassification=m,x.getRoots=v,x.getRootForClassification=w,x}]),angular.module("orphaApp").controller("DisorderCtrl",["$scope","$stateParams","Disorder","$log","Page","promiseTracker","$modal","modalService","Sign","Gene",function(a,b,c,d,e,f,g,h,i,j){function k(){var a=c.get({nid:b.disorderId},function(a){v.disorder=a,v.disorder.loadChildren(),v.disorder.loadParents(),v.disorder.loadExternalIdentifiers(),c.getParentsFromDisorderInClassification(a).then(function(a){_.each(a,function(a){_.each(a.disorder_class,function(b){var c=_.find(v.disorder.disorder_class,{nid:b.nid});c&&(c.parents=c.parents||[],c.parents.push(a))})})}),e.setTitle(a.title);var b=a.getGenes(),d=a.getSigns();d.then(function(){_.each(a.disorder_phenotype,function(a){i.get({nid:a.ds_sign.nid}).$promise.then(function(b){a.ds_sign=b,b.loadDisorders(!0)})})}),b.then(function(){_.each(a.disorder_disgene,function(a){j.get({nid:a.disgene_gene.nid}).$promise.then(function(b){a.disgene_gene=b,b.loadDisorders(!0)})})}),v.genesTracker.addPromise(b)});v.disorderTracker.addPromise(a.$promise),v.signsTracker.addPromise(a.$promise),v.genesTracker.addPromise(a.$promise)}function l(){v.isEditing=!0}function m(){v.isEditing=!1}function n(){return h.openEditDescription(v.disorder)}function o(a){a.isShowingParents=!a.isShowingParents,a.getParents().then(function(a){console.log("parents",a)})}function p(){return h.openEditTitle(v.disorder)}function q(){return h.openAgeOfOnset(v.disorder)}function r(){return h.openPrevalenceClassModal(v.disorder)}function s(){return h.openAgeOfDeath(v.disorder)}function t(a){{var b={relationshipNode:a,leftNode:v.disorder,rightNode:a.disgene_gene};g.open({templateUrl:"views/editdisordergene.modal.html",controller:"EditDisorderGeneCtrl as editVm",resolve:{config:function(){return b}}})}}function u(a){{var b={relationshipNode:a,leftNode:v.disorder,rightNode:a.ds_sign};g.open({templateUrl:"views/editdisorderphenotype.modal.html",controller:"EditDisorderPhenotypeCtrl as vm",resolve:{config:function(){return b}}})}}var v=a;v.disorderTracker=f(),v.disorder=null,v.signsTracker=f(),v.genesTracker=f(),v.toggleParents=o,v.editAgeOfOnset=q,v.editPrevalenceClass=r,v.editAgeOfDeath=s,v.editDisorderGene=t,v.editDisorderPhenotype=u,v.startEditing=l,v.stopEditing=m,v.editTitle=p,v.isEditing=!1,v.editDescription=n,k()}]),angular.module("orphaApp").factory("Gene",["$resource","ENV","$log","$q","$http","Disorder",function(a,b,c,d,e,f){function g(a){var b=20,c=this,e=_.pluck(c.gene_disgene,"nid");return 0===e.length?(c.classifications=[],d.when([])):(e.length>b&&a&&(e=e.slice(0,b)),c.gene_disgene=[],h(c,e,0).then(function(a){c.gene_disgene=a;var b=[];return _.each(a,function(a){b.push(a.disgene_disorder.nid)}),i(c,b,0).then(function(a){var b=_.pluck(a,"disorder_class");return c.classifications=_.flatten(b),a})}))}function h(a,c,f){var g={"parameters[type]":"disorder_gene"},i=c.slice(20*f,20*f+20);return _.each(i,function(a,b){g["parameters[nid]["+b+"]"]=a}),0===i.length?d.when([]):e.get(b.apiEndpoint+"/entity_node",{params:g,cache:!0}).then(function(b){var d=b.data;return 20===d.length?h(a,c,f+1).then(function(a){return d.concat(a)}):d})}function i(a,b,c){if(0===b.length)return d.when([]);var e={fields:"nid,title,disorder_class,body"},g=b.slice(20*c,20*c+20);return _.each(g,function(a,b){e["parameters[nid]["+b+"]"]=a}),0===g.length?d.when([]):f.query(e).$promise.then(function(d){return _.each(d,function(b){_.each(a.gene_disgene,function(a){a.disgene_disorder.nid===b.nid&&angular.copy(b,a.disgene_disorder)})}),20===d.length?i(a,b,c+1).then(function(a){return d.concat(a)}):d})}var j=a(b.apiEndpoint+"/entity_node/:nid",{"parameters[type]":"gene",nid:"@nid"});return j.prototype.loadDisorders=g,j}]),angular.module("orphaApp").service("RelationshipService",["$http","$q","ENV",function(a,b,c){this.getRelatedThroughIntermediary=function(d,e,f){var g=_.first(d[e]);if(!d[e].length)return b.when();var h=_.pluck(d[e],"nid"),i=_.indexBy(h,function(a,b){return"parameters[nid]["+b+"]"});return i["paramaters[type]"]=g.type,i.fields=["nid","type","title"].concat(f).join(","),a.get(c.apiEndpoint+"/entity_node",{params:i}).then(function(a){var b=a.data;d[e]=b})},this.getRelated=function(){}}]),angular.module("orphaApp").factory("Sign",["$resource","$http","ENV","Gene","RelationshipService","Disorder","$log","$q",function(a,b,c,d,e,f,g,h){function i(){var a=this,b=_.pluck(a.sign_child,"nid"),c={};return _.each(b,function(a,b){c["parameters[nid]["+b+"]"]=a}),0===b.length?(a.sign_child=[],h.when([])):b.length?m.query(c).$promise.then(function(b){return a.sign_child=b,b}):h.when([])}function j(a){var b=20,c=this,d=_.pluck(c.sign_dissign,"nid");return 0===d.length?(c.disorders=[],c.classifications=[],h.when([])):(d.length>b&&a&&(d=d.slice(0,b)),c.disorders=[],k(c,d,0).then(function(a){var b=[];return _.each(a,function(a){b.push(a.ds_disorder.nid)}),l(c,b,0).then(function(a){var b=_.pluck(a,"disorder_class");return c.classifications=_.flatten(b),a})}))}function k(a,d,e){var f={"parameters[type]":"disorder_sign",fields:"ds_disorder"},g=d.slice(20*e,20*e+20);return _.each(g,function(a,b){f["parameters[nid]["+b+"]"]=a}),0===g.length?h.when([]):b.get(c.apiEndpoint+"/entity_node",{params:f,cache:!0}).then(function(b){var c=b.data;return a.disorders=a.disorders.concat(_.pluck(c,"ds_disorder")),20===c.length?k(a,d,e+1).then(function(a){return c.concat(a)}):c})}function l(a,b,c){if(0===b.length)return h.when([]);var d={fields:"nid,title,disorder_class"},e=b.slice(20*c,20*c+20);return _.each(e,function(a,b){d["parameters[nid]["+b+"]"]=a}),0===e.length?h.when([]):f.query(d).$promise.then(function(d){return _.each(d,function(b){var c=_.find(a.disorders,{nid:b.nid});angular.copy(b,c)}),20===d.length?l(a,b,c+1).then(function(a){return d.concat(a)}):d})}var m=a(c.apiEndpoint+"/entity_node/:nid",{"parameters[type]":"clinical_sign",nid:"@nid"});return m.prototype.loadDisorders=j,m.prototype.loadChildren=i,m}]),angular.module("orphaApp").controller("DisordersCtrl",["$scope","$timeout","$stateParams","promiseTracker","Classification","Page","Disorder","$q","$log",function(a,b,c,d,e,f,g,h){function i(){j(),f.setTitle("All Classifications")}function j(){return e.getAll({}).then(function(a){k.classifications=a;var b=[g.query({fields:"title,disorder_nochildren,disorder_class","parameters[disorder_root]":1,page:0}).$promise,g.query({fields:"title,disorder_nochildren,disorder_class","parameters[disorder_root]":1,page:1}).$promise];h.all(b).then(function(a){var b=_.flatten(a);_.forEach(b,function(a){var b=_.find(k.classifications,{nid:a.disorder_class[0].nid});b.count=a.disorder_nochildren})})})}var k=this;k.classifications=null,i()}]),angular.module("orphaApp").controller("GenesCtrl",["$scope","Gene","promiseTracker","Page",function(a,b,c,d){function e(){d.setTitle("Genes"),g(a.page++).then(function(b){a.genes=b})}function f(){g(a.page++).then(function(b){a.genes=a.genes.concat(b)})}function g(c){var d=b.query({fields:"nid,gene_name,gene_symbol,gene_disgene",page:c}),e=d.$promise;return e.then(function(a){_.each(a,function(a){a.loadDisorders(!0)})}),a.loadingTracker.addPromise(e),e}a.loadMore=f,a.loadingTracker=c(),a.page=0,e()}]),angular.module("orphaApp").controller("GeneCtrl",["$scope","$stateParams","Gene","Disorder","promiseTracker","Page",function(a,b,c,d,e,f){function g(){c.get({nid:b.geneId}).$promise.then(function(b){a.gene=b,f.setTitle(b.title),b.loadDisorders()})}a.disordersTracker=e(),a.geneTracker=e(),g()}]),angular.module("orphaApp").factory("searchService",["$http","ENV","$state",function(a,b){function c(c){var d=encodeURIComponent(c),e=b.apiEndpoint+"/search_node/retrieve.json?keys="+d+"&simple=1";return a.get(e).then(function(a){return a.data})}var d={search:c};return d}]),angular.module("orphaApp").controller("SignCtrl",["$scope","$stateParams","Disorder","Sign","promiseTracker","Page",function(a,b,c,d,e,f){function g(){a.limit+=20}function h(){d.get({nid:b.signId}).$promise.then(function(b){a.sign=b,b.sign_parent=_.reject(b.sign_parent,function(a){return"_NO_NAME_"===a.title}),f.setTitle(b.title),b.loadDisorders(),b.loadChildren().then(function(a){_.each(a,function(a){a.loadDisorders(!0)})})})}a.signTracker=e(),a.limit=10,a.disordersTracker=e(),a.showMore=g,h()}]),angular.module("orphaApp").directive("cmTree",function(){return{templateUrl:"views/cmtree.html",restrict:"E",scope:{disorder:"="},link:function(){}}}),angular.module("orphaApp").factory("Page",function(){function a(a){b.title="",a&&a.length&&(b.title+=a+" - "),b.title+="HPO - Human Phenotype Ontology"}var b={title:null,setTitle:a};return b}),angular.module("orphaApp").controller("SignsCtrl",["$scope","Sign","promiseTracker","Page",function(a,b,c,d){function e(){d.setTitle("All Clinical Signs"),g(a.page++).then(function(b){a.signs=b})}function f(){g(a.page++).then(function(b){a.signs=a.signs.concat(b)})}function g(c){var d=b.query({fields:"nid,sign_name,sign_dissign,title",page:c}),e=d.$promise;return e.then(function(a){var b=!1;_.each(a,function(a,c){return"_NO_NAME_"===a.title?void(b=c):void a.loadDisorders(!0)}),b&&a.splice(b,1)}),a.loadingTracker.addPromise(e),e}a.loadMore=f,a.loadingTracker=c(),a.page=0,e()}]),angular.module("orphaApp").factory("ListTransaction",["$resource","ENV","$http","$q",function(a,b,c,d){function e(){var a=this;return a.title="Loading...",a.isRefChange=a.ltrans_svalref?!0:!1,d.all([f(a),g(a),h(a)]).then(function(){return a.title=a.ltrans_onnode.title,a})}function f(a){var d=a.ltrans_onnode,e={fields:"nid,title,type,disgene_disorder,disgene_gene,ds_sign,ds_disorder"};return c.get(b.apiEndpoint+"/entity_node/"+d,{params:e}).then(function(b){a.ltrans_onnode=b.data})}function g(a){var e=a.ltrans_svalref;if(!e)return d.when(!1);var f={fields:"nid,title"};return c.get(b.apiEndpoint+"/entity_node/"+e,{params:f}).then(function(b){a.ltrans_svalref=b.data})}function h(a){var e=a.ltrans_cvalref;if(!e)return d.when(!1);var f={fields:"nid,title"};return c.get(b.apiEndpoint+"/entity_node/"+e,{params:f}).then(function(b){a.ltrans_cvalref=b.data})}var i=a(b.apiEndpoint+"/entity_node/:nid",{"parameters[type]":"list_transaction",nid:"@nid"});return i.prototype.loadReferences=e,i}]),angular.module("orphaApp").controller("SuggestionsCtrl",["$http","$scope","ENV","suggestionService","TransactionRequest","$log","$q","transactionStatusService","Page",function(a,b,c,d,e,f,g,h,i){function j(){return i.setTitle("Suggestions"),h.loadStatusCodes().then(function(){e.getOpen().then(function(a){l.openSuggestions=a,l.suggestions=l.openSuggestions,_.each(a,function(a){a.isSubmitted=!0})}),e.getClosed().then(function(a){_.each(a,function(a){a.isAccepted=h.isAcceptedTr(a),a.isRejected=h.isRejectedTr(a)}),l.closedSuggestions=a})})}function k(a){l.suggestions=null,l.suggestions=a?l.openSuggestions:l.closedSuggestions}var l=this;l.suggestions=null,l.openSuggestions=null,l.closedSuggestions=null,l.isShowingOpen=!0,l.suggestionTypeChanged=k,j()}]),angular.module("orphaApp").controller("EditModalCtrl",["$scope","$http","$modalInstance","ENV","ListTransaction","config","TransactionRequest","transactionStatusService","toaster",function(a,b,c,d,e,f,g,h,i){function j(){return k()}function k(){return b.get(d.apiEndpoint+"/entity_node",{params:{"parameters[type]":n.propertyContentType,fields:"nid,title"}}).then(function(a){n.prevalenceClasses=a.data,n.prevalenceClass=_.find(n.prevalenceClasses,{nid:n.concept[n.propertyName].nid})})}function l(){var a=new e({title:n.concept.title,type:"list_transaction",ltrans_position:0,ltrans_onnode:n.concept.nid,ltrans_onprop:n.propertyName,ltrans_svalref:n.prevalenceClass.nid,ltrans_cvalref:n.concept[n.propertyName]&&n.concept[n.propertyName].nid||null,body:{value:n.reason,summary:n.reason}});a.$save().then(function(){return h.loadStatusCodes().then(function(){var b=new g({title:n.concept.title+" - "+n.propertyLabel,type:"transaction_request",tr_timestamp:(new Date).getTime()/1e3,tr_trans:[a.nid],tr_status:h.submittedNid,tr_user:0,body:{value:n.reason,summary:n.reason}});return i.pop("success","Suggestion submitted."),b.$save()})}),c.close()}function m(){c.dismiss("cancel")}var n=this;n.concept=f.concept,n.propertyName=f.propertyName,n.propertyContentType=f.propertyContentType,n.propertyLabel=f.propertyLabel,n.save=l,n.cancel=m,n.stuff=null,n.prevalenceClasses=null,n.prevalenceClass=null,n.reason="",j()}]),angular.module("orphaApp").factory("PrevalenceClass",["$resource","ENV",function(a,b){var c=a(b.apiEndpoint+"/entity_node/:nid",{"parameters[type]":"prevalence_class",nid:"@nid"});return c}]),angular.module("orphaApp").factory("suggestionService",["$http","ENV","ListTransaction",function(a,b,c){function d(){return c.query({}).$promise.then(function(c){var d=_.pluck(c,"ltrans_svalref"),e=_.indexBy(d,function(a,b){return"parameters[nid]["+b+"]"});e.fields="nid,title",a.get(b.apiEndpoint+"/entity_node",{params:e}).then(function(a){var b=a.data;_.each(c,function(a){a.ltrans_svalref=_.find(b,{nid:a.ltrans_svalref})})});var f=_.pluck(c,"ltrans_onnode"),g=_.indexBy(f,function(a,b){return"parameters[nid]["+b+"]"});g.fields="nid,title,type,disgene_disorder,disgene_gene",a.get(b.apiEndpoint+"/entity_node",{params:g}).then(function(a){var b=a.data;_.each(b,function(a){"disorder_gene"===a.type&&(a.related=[a.disgene_disorder,a.disgene_gene])}),_.each(c,function(a){a.ltrans_onnode=_.find(b,{nid:a.ltrans_onnode})})});var h=_.pluck(c,"ltrans_cvalref"),i=_.indexBy(h,function(a,b){return"parameters[nid]["+b+"]"});return i.fields="nid,title",a.get(b.apiEndpoint+"/entity_node",{params:i}).then(function(a){var b=a.data;_.each(c,function(a){a.ltrans_cvalref=_.find(b,{nid:a.ltrans_cvalref})})}),c})}var e={getNewSuggestions:d};return e}]),angular.module("orphaApp").factory("paramService",function(){function a(){}var b={toQuery:a};return b}),angular.module("orphaApp").controller("EditDisorderGeneCtrl",["$scope","$http","$modalInstance","config","ENV","ListTransaction","$q","TransactionRequest","toaster","transactionStatusService",function(a,b,c,d,e,f,g,h,i,j){function k(){n(),o()}function l(){c.dismiss("cancel")}function m(){var a=[];if(p.disorderGene.disgene_as.nid!==p.disorderGeneStatus.nid){var b="disgene_as",d=new f({title:"transaction",type:"list_transaction",ltrans_position:a.length,ltrans_onnode:p.disorderGene.nid,ltrans_onprop:b,ltrans_svalref:p.disorderGeneStatus.nid,ltrans_cvalref:p.disorderGene[b].nid});a.push(d.$save())}if(p.disorderGene.disgene_at.nid!==p.disorderGeneType.nid){var e="disgene_at",k=new f({title:"transaction",type:"list_transaction",ltrans_position:a.length,ltrans_onnode:p.disorderGene.nid,ltrans_onprop:e,ltrans_svalref:p.disorderGeneType.nid,ltrans_cvalref:p.disorderGene[e].nid});a.push(k.$save())}g.all(a).then(function(a){var b=_.pluck(a,"nid");return j.loadStatusCodes().then(function(){var a=new h({title:"Relationship between "+p.disorder.title+" and "+p.gene.title,type:"transaction_request",tr_timestamp:(new Date).getTime()/1e3,tr_trans:b,tr_status:j.submittedNid,tr_user:0,body:{value:p.reason,summary:p.reason}});return i.pop("success","Suggestion submitted."),a.$save()})}),c.dismiss("cancel")}function n(){return b.get(e.apiEndpoint+"/entity_node",{params:{"parameters[type]":"disorder_gene_as",fields:"nid,title"}}).then(function(a){p.disorderGeneStatuses=a.data,p.disorderGeneStatus=_.find(p.disorderGeneStatuses,{nid:p.disorderGene.disgene_as.nid})})}function o(){return b.get(e.apiEndpoint+"/entity_node",{params:{"parameters[type]":"disorder_gene_at",fields:"nid,title"}}).then(function(a){p.disorderGeneTypes=a.data,p.disorderGeneType=_.find(p.disorderGeneTypes,{nid:p.disorderGene.disgene_at.nid})})}var p=this;p.disorderGene=d.relationshipNode,p.gene=d.rightNode,p.proposalType="edit",p.disorder=d.leftNode,p.disorderGeneStatuses=null,p.disorderGeneStatus=null,p.disorderGeneTypes=null,p.disorderGeneType=null,p.reason=null,p.cancel=l,p.proposeChanges=m,k()}]),angular.module("orphaApp").factory("TransactionRequest",["$resource","$http","ENV","ListTransaction","$q","$state","$log","transactionStatusService",function(a,b,c,d,e,f,g,h){function i(a){return a||(a=0),h.loadStatusCodes().then(function(){return p.query({"parameters[tr_status]":h.submittedNid,page:a}).$promise.then(function(b){return 20!==b.length?b:i(a+1).then(function(a){return b.concat(a)})},function(){return[]})})}function j(a){return a||(a=0),h.loadStatusCodes().then(function(){var b=p.query({"parameters[tr_status]":h.acceptedNid,page:a}).$promise.then(function(a){return a},function(){return[]}),c=p.query({"parameters[tr_status]":h.rejectedNid,page:a}).$promise.then(function(a){return a},function(){return[]});return e.all([b,c]).then(function(b){var c=_.flatten(b);return 20!==b[0].length&&20!==b[1].length?c:j(a+1).then(function(a){return c.concat(a)})})})}function k(a){return a}function l(){var a=this;return h.loadStatusCodes().then(function(){return b.put(c.apiEndpoint+"/entity_node/"+a.nid,{nid:a.nid,tr_status:h.acceptedNid})})}function m(){var a=this;return h.loadStatusCodes().then(function(){return b.put(c.apiEndpoint+"/entity_node/"+a.nid,{nid:a.nid,tr_status:h.rejectedNid})})}function n(){var a=this;if(!a.tr_trans.length)return a.title;var b=a.tr_trans[0],c=b.ltrans_onnode;if("disorder_gene"===c.type)return void(a.description='Relationship between <a href="'+f.href("gene",{geneId:c.disgene_gene.nid})+'">'+c.disgene_gene.title+'<a/> and <a href="'+f.href("disorder",{disorderId:c.disgene_disorder.nid})+'">'+c.disgene_disorder.title+"</a>");if("disorder_sign"===c.type)return void(a.description='Relationship between <a href="'+f.href("sign",{signId:c.ds_sign.nid})+'">'+c.ds_sign.title+'<a/> and <a href="'+f.href("disorder",{disorderId:c.ds_disorder.nid})+'">'+c.ds_disorder.title+"</a>");var d={};d[c.type+"Id"]=c.nid,a.description='<a href="'+f.href(c.type,d)+'">'+c.title+"</a>"}function o(){var a=this;a.description="Loading...";var b=_.pluck(a.tr_trans,"nid");if(!b.length)return e.when([]);var c=_.indexBy(b,function(a,b){return"parameters[nid]["+b+"]"});return d.query(c).$promise.then(function(b){a.tr_trans=b;var c=_.map(b,function(a){return a.loadReferences()});return e.all(c).then(function(){return b})})}var p=a(c.apiEndpoint+"/entity_node/:nid",{"parameters[type]":"transaction_request",nid:"@nid"},{get:{method:"GET",transformResponse:b.defaults.transformResponse.concat([k])},update:{method:"PUT"}});return p.prototype.loadTransactions=o,p.prototype.loadDescription=n,p.prototype.accept=l,p.prototype.reject=m,p.getOpen=i,p.getClosed=j,p}]),angular.module("orphaApp").controller("SuggestionCtrl",["$stateParams","TransactionRequest","$state","$http","toaster","transactionStatusService","$log",function(a,b,c,d,e,f,g){function h(){b.get({nid:a.suggestionId}).$promise.then(function(a){a.loadTransactions().then(function(){a.loadDescription()}),l.suggestion=a,f.loadStatusCodes().then(function(){g.debug("status codes loaded",l.suggestion.tr_status),l.isOpen=!f.isClosed(l.suggestion.tr_status.nid),l.suggestion.isAccepted=f.isAcceptedTr(l.suggestion),l.suggestion.isRejected=f.isRejectedTr(l.suggestion),l.suggestion.isSubmitted=f.isSubmittedTr(l.suggestion)})})}function i(a){a.accept().then(function(){e.pop("success","Suggestion Accepted"),c.go("suggestions")})}function j(a){a.reject().then(function(){e.pop("success","Suggestion Rejected"),c.go("suggestions")})}function k(a){l.comments.push(a),l.comment={}}var l=this;l.suggestion=null,l.accept=i,l.reject=j,l.comments=[],l.comment={},l.addComment=k,l.isOpen=!1,h()}]),angular.module("orphaApp").factory("propertyService",function(){var a=42;return{someMethod:function(){return a}}}),angular.module("orphaApp").factory("modalService",["$modal",function(a){function b(b){var c={concept:b,propertyName:"title",propertyLabel:"Disorder Name"};return a.open({templateUrl:"views/edittitle.modal.html",controller:"EditTitleCtrl as vm",resolve:{config:function(){return c}}})}function c(b){var c={concept:b,propertyName:"body",propertyLabel:"Description"};return a.open({templateUrl:"views/editbody.modal.html",controller:"EditTitleCtrl as vm",resolve:{config:function(){return c}}})}function d(a){return g(a,"Prevalence Class","disorder_prevalence","prevalence_class")}function e(a){return g(a,"Age of Onset","disorder_onset","age_of_onset")}function f(a){return g(a,"Age of Death","disorder_death","age_of_death")}function g(b,c,d,e){var f={concept:b,propertyLabel:c,propertyName:d,propertyContentType:e};return a.open({templateUrl:"views/edit.modal.html",controller:"EditModalCtrl as editVm",resolve:{config:function(){return f}}})}var h={openPrevalenceClassModal:d,openAgeOfOnset:e,openAgeOfDeath:f,openEditTitle:b,openEditDescription:c};return h}]),angular.module("orphaApp").controller("EditDisorderPhenotypeCtrl",["$scope","$http","$modalInstance","config","ENV","ListTransaction","$q","TransactionRequest","toaster","transactionStatusService",function(a,b,c,d,e,f,g,h,i,j){function k(){m()}function l(){c.dismiss("cancel")}function m(){return b.get(e.apiEndpoint+"/entity_node",{params:{"parameters[type]":"sign_frequency",fields:"nid,title"}}).then(function(a){o.disorderSignFrequencies=a.data,o.disorderSignFrequency=_.find(o.disorderSignFrequencies,{nid:o.disorderSign.ds_frequency.nid})})}function n(){var a="ds_frequency",b=new f({title:"transaction",type:"list_transaction",ltrans_position:0,ltrans_onnode:o.disorderSign.nid,ltrans_onprop:a,ltrans_svalref:o.disorderSignFrequency.nid,ltrans_cvalref:o.disorderSign[a].nid});b.$save().then(function(a){return j.loadStatusCodes().then(function(){var b=new h({title:"Relationship between "+o.disorder.title+" and "+o.sign.title,type:"transaction_request",tr_timestamp:(new Date).getTime()/1e3,tr_trans:[a.nid],tr_status:j.submittedNid,tr_user:0,body:{value:o.reason,summary:o.reason}});return i.pop("success","Suggestion submitted."),b.$save()})}),c.dismiss("cancel")}var o=this;o.disorderSign=d.relationshipNode,o.disorder=d.leftNode,o.sign=d.rightNode,o.proposalType="edit",o.disorderSignFrequencies=null,o.reason=null,o.cancel=l,o.proposeChanges=n,k()}]),angular.module("orphaApp").controller("EditTitleCtrl",["$scope","$http","$modalInstance","ENV","ListTransaction","config","TransactionRequest","transactionStatusService","toaster",function(a,b,c,d,e,f,g,h,i){function j(){}function k(){var a=new e({title:m.concept.title,type:"list_transaction",ltrans_position:0,ltrans_onnode:m.concept.nid,ltrans_onprop:m.propertyName,ltrans_svalplain:m.propertyValue,ltrans_cvalplain:m.concept[m.propertyName].substring(0,500),body:{value:m.reason,summary:m.reason}});a.$save().then(function(){return h.loadStatusCodes().then(function(){var b=new g({title:m.concept.title+" - "+m.propertyLabel,type:"transaction_request",tr_timestamp:(new Date).getTime()/1e3,tr_trans:[a.nid],tr_status:h.submittedNid,tr_user:0,body:{value:m.reason,summary:m.reason}});return i.pop("success","Suggestion submitted."),b.$save()})}),c.close()}function l(){c.dismiss("cancel")}var m=this;m.concept=f.concept,m.propertyName=f.propertyName,m.propertyLabel=f.propertyLabel,m.propertyValue=m.concept[m.propertyName].substring(0,400),m.save=k,m.cancel=l,m.reason="",j()}]),angular.module("orphaApp").controller("HomerCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("orphaApp").controller("HomeCtrl",["Disorder","Classification","$log","Page","$q",function(a,b,c,d,e){function f(){g(),d.setTitle("")}function g(){return b.getAll({}).then(function(b){h.classifications=b;var c=[a.query({fields:"title,disorder_nochildren,disorder_class","parameters[disorder_root]":1,page:0}).$promise,a.query({fields:"title,disorder_nochildren,disorder_class","parameters[disorder_root]":1,page:1}).$promise];e.all(c).then(function(a){var b=_.flatten(a);_.forEach(b,function(a){var b=_.find(h.classifications,{nid:a.disorder_class[0].nid});b.count=a.disorder_nochildren})})})}var h=this;h.classifications=null,f()}]),angular.module("orphaApp").controller("ClassificationCtrl",["$scope","$stateParams","$log","Disorder","Classification","Page","searchService","$q","$location",function(a,b,c,d,e,f,g,h){function i(){b.disorderId?j():l()}function j(){f.setTitle("Locating..."),d.get({nid:b.disorderId}).$promise.then(function(a){c.debug("selected disorder",a,a.title,a.nid),u.initialDisorder=a,a.disorder_child.length&&m(a),k(a)})}function k(a){c.debug("opening parents",a),a.getParents({nid:b.classificationId}).then(function(d){if(!d||!d.length)return u.rootDisorder=a,u.classification=_.find(a.disorder_class,{nid:b.classificationId}),e.get({nid:u.classification.nid}).$promise.then(function(a){u.classification=a,f.setTitle(u.initialDisorder.title+" in "+u.classification.title)}),void c.debug("root disorder class",u.rootDisorder,u.classification);c.debug("parents are",d);var g=d[0];u.rootDisorder=g,g.isOpen=!0,u.selectedDisorder||m(g),k(g)})}function l(){return e.get({nid:b.classificationId},function(a){return u.classification=a,f.setTitle(a.title),d.getRootForClassification(a).then(function(a){u.rootDisorder=a,m(u.rootDisorder)
})})}function m(a,b){return u.selectedDisorder=a,u.filters.classifications=[],r(u.selectedDisorder.disorder_child),o(a,b)}function n(a){return a.isOpen?void p(a):o(a)}function o(a,b){return a.isOpen=!0,a.loadChildren(u.classification).then(function(d){return 0===d.length?void m(b):(c.debug("open",a),void r(u.selectedDisorder.disorder_child))})}function p(a){a.isOpen=!1,_.each(a.disorder_child,function(a){p(a)})}function q(a){var b=_.pluck(u.visibleDisorders,"nid");return b.indexOf(a.nid)<0?!1:!0}function r(a){u.visibleDisorders=a,s(u.visibleDisorders)}function s(a){if(0===a.length||!angular.isDefined(a[0].disorder_class))return void(u.classifications=[]);var b=_.flatten(_.pluck(a,"disorder_class"));u.classifications=_.reject(_.uniq(b,"nid"),function(a){return _.find(u.filters.classifications,{nid:a.nid})})}function t(a){if(c.debug("filtering by classification",a),0===u.filters.classifications.length)return void(u.selectedDisorder&&r(u.selectedDisorder.disorder_child));var b=_.filter(u.selectedDisorder.disorder_child,function(b){var c=_.pluck(a,"nid"),d=_.pluck(b.disorder_class,"nid"),e=_.intersection(c,d);return e.length!==c.length?!1:!0},[]);r(b)}var u=this;u.classification=null,u.rootDisorder=null,u.selectedDisorder=null,u.filters={classifications:[]},u.visibleDisorders=[],u.initialDisorder=null,u.selectDisorder=m,u.filterByClassifications=t,u.toggleOpen=n,u.filterDisorders=q,i()}]),angular.module("orphaApp").factory("Classification",["$resource","$q","ENV","$log",function(a,b,c,d){function e(){return b.all([l.query({page:0}).$promise,l.query({page:1}).$promise]).then(function(a){var b=_.flatten(a);return _.each(b,function(a){var b=i(a.title);b&&(a.color=b.color)}),b})}function f(){return k}function g(a){var b=i(a);return b?b.color:"#eeeeee"}function h(a){var b=i(a);return b?k.indexOf(b):0}function i(a){var b=_.find(k,{title:a});return b||d.error("No classification found for:",a),b}function j(){var a=this,b=i(a.title);return b.color}var k=[{title:"Abnormality of the genitourinary system"},{title:"Abnormality of head and neck"},{title:"Abnormality of the eye"},{title:"Abnormality of the ear"},{title:"Abnormality of the nervous system"},{title:"Abnormality of the breast"},{title:"Abnormality of the endocrine system"},{title:"Abnormality of the skeletal system"},{title:"Abnormality of prenatal development or birth"},{title:"Abnormality of the abdomen"},{title:"Growth abnormality"},{title:"Abnormality of the integument"},{title:"Abnormality of the voice"},{title:"Abnormality of the cardiovascular system"},{title:"Abnormality of blood and blood-forming tissues"},{title:"Abnormality of metabolism/homeostasis"},{title:"Abnormality of the respiratory system"},{title:"Neoplasm"},{title:"Abnormality of the immune system"},{title:"Abnormality of the musculature"},{title:"Abnormality of connective tissue"}];_.each(k,function(a,b){var c=320/k.length*b,d=70,e=70;a.color="hsla("+c+", "+d+"%, "+e+"%, 1)"});var l=a(c.apiEndpoint+"/entity_node/:nid",{"parameters[type]":"disorder_classification",nid:"@nid"});return l.getAll=e,l.getColorForClassificationName=g,l.getPositionForClassificationName=h,l.getMetadata=f,l.prototype.getColor=j,l}]),angular.module("orphaApp").factory("disorderRepo",function(){var a=42;return{someMethod:function(){return a}}}),angular.module("orphaApp").factory("siteSearchService",["searchService","$state","$log","$rootScope",function(a,b,c,d){function e(b){var c=["Disorder","Clinical Sign","Gene"];return a.search(b).then(function(a){return _.filter(a,function(a){return c.indexOf(a.type)>=0})})}function f(a){var c={},d=a.type.toLowerCase();"clinical sign"===d&&(d="sign"),c[d+"Id"]=a.node,b.go(d,c)}var g={query:"",getResults:e,changed:f};return d.$on("$stateChangeSuccess",function(){g.query=""}),g}]),angular.module("orphaApp").factory("disorderBodyService",["$http",function(a){function b(a){return e[a.title]||c}var c="<p>The incorporation of HPO summaries for concepts is currently under development.",d={getBody:b},e={};return a.get("scripts/services/disorderbody.json").then(function(a){angular.copy(a.data,e)}),d}]),angular.module("orphaApp").factory("transactionStatusService",["$http","ENV","$log","$q",function(a,b,c,d){function e(){return n?d.when(o):a.get(b.apiEndpoint+"/entity_node",{params:{"parameters[type]":"tr_status"}}).then(function(a){return n=!0,m=a.data,o.submittedNid=_.find(m,{title:"Submitted"}).nid,o.acceptedNid=_.find(m,{title:"Accepted"}).nid,o.rejectedNid=_.find(m,{title:"Rejected"}).nid,o})}function f(a){return i(a.tr_status.nid)}function g(a){return j(a.tr_status.nid)}function h(a){return k(a.tr_status.nid)}function i(a){return a===o.acceptedNid}function j(a){return a===o.rejectedNid}function k(a){return a===o.submittedNid}function l(a){return i(a)||j(a)}var m=null,n=!1,o={loadStatusCodes:e,isAccepted:i,isRejected:j,isSubmitted:k,isAcceptedTr:f,isRejectedTr:g,isSubmittedTr:h,isClosed:l,acceptedNid:null,rejectedNid:null,submittedNid:null};return o}]),angular.module("orphaApp").directive("colormap",["$log","Classification",function(a,b){return{templateUrl:"views/colormap.html",restrict:"E",scope:{classifications:"=",classification:"=",type:"@"},link:function(c){function d(d){if(c.type&&""!==c.type&&"disorder"!==c.type){var h=0,i=angular.copy(b.getMetadata());_.each(d,function(b){var c=_.find(i,{title:b.title});c||a.error("No matching classification found",b),_.extend(c,b),c.tooltip=g(c.title),c.isOn=!0,c.count||(c.count=0),c.count++,c.count>h&&(h=c.count)}),_.each(i,function(a){var b=e(c.type),d=100,g=f(a.count,h);a.color="hsla("+b+", "+d+"%, "+g+"%, 1)"}),c.myClassifications=i}else _.each(d,function(a){a.color=b.getColorForClassificationName(a.title),a.tooltip=g(a.title),a.position=b.getPositionForClassificationName(a.title)}),c.myClassifications=d}function e(b){return"sign"===b?20:"gene"===b?200:(a.error("No hue found"),300)}function f(a,b){return 100-a/b*50}function g(a){return'<div style="display:inline-block;margin-right:5px;width:10px;height:10px;background-color:'+b.getColorForClassificationName(a)+'"></div>'+a}function h(){c.allClassifications=[{name:"Rare genetic disease",color:"#666699"},{name:"Rare neurologic disease",color:"#ff0000"},{name:"Rare allergic disease",color:"#990000"},{name:"Rare cardiac disease",color:"#9900ff"},{name:"Rare surgical cardiac disease",color:"#99ccff"},{name:"Rare circulatory system disease",color:"#663333"},{name:"Rare hematologic disease",color:"#cc6666"},{name:"Rare skin disease",color:"#ff9999"},{name:"Rare renal disease",color:"#ff99ff"},{name:"Rare odontologic disease",color:"#993399"},{name:"Rare infectious disease",color:"#ff00ff"},{name:"Rare gastroenterologic disease",color:"#660066"},{name:"Rare gynecologic or obstetric disease",color:"#cc99ff"},{name:"Rare abdominal surgical disease",color:"#0000ff"},{name:"Rare hepatic disease",color:"#ccccff"},{name:"Rare maxillo-facial surgical disease",color:"#3399ff"},{name:"Rare developmental defect during embryogenesis",color:"#336666"},{name:"Rare immune disease",color:"#669999"},{name:"Rare teratologic disease",color:"#00ffff"},{name:"Rare systemic or rheumatologic disease",color:"#006666"},{name:"Rare neoplastic disease",color:"#006633"},{name:"Rare urogenital disease",color:"#00cc66"},{name:"Rare infertility",color:"#33ff99"},{name:"Rare otorhinolaryngologic disease",color:"#339933"},{name:"Rare intoxication",color:"#666633"},{name:"Rare surgical thoracic disease",color:"#cccc99"},{name:"Rare endocrine disease",color:"#ffff33"},{name:"Rare respiratory disease",color:"#ffcc00"},{name:"Rare eye disease",color:"#996600"},{name:"Rare bone disease",color:"#999933"},{name:"Unknown",color:"#eee"},{name:"Inborn errors of metabolism",color:"#000099"}],_.each(c.allClassifications,function(a,b){var c=320/31*b,d=70,e=70;a.color="hsla("+c+", "+d+"%, "+e+"%, 1)"})}h(),c.$watch("classifications",function(a){a&&d(a)}),c.$watch("classification",function(a){a&&d([a])})}}}]);