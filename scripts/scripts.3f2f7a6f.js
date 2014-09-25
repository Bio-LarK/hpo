"use strict";angular.module("hpoApp",["ngAnimate","ngCookies","ngResource","ngSanitize","ngTouch","ui.router","config","dotjem.angular.tree","ui.bootstrap","ajoslin.promise-tracker","toaster","monospaced.elastic","textAngular","ui.select"]).run(["$state","$stateParams","$rootScope","searchService","pageService",function(a,b,c,d,e){c.$state=a,c.$stateParams=b,c.searchService=d,c.pageService=e}]).config(["$stateProvider","$urlRouterProvider","uiSelectConfig",function(a,b,c){c.theme="bootstrap",b.otherwise("/phenotypes"),a.state("suggestions",{url:"/suggestions",controller:"SuggestionsCtrl as vm",templateUrl:"views/suggestions.html"}).state("suggestion",{url:"/suggestions/:suggestionId",controller:"SuggestionCtrl as vm",templateUrl:"views/suggestion.html"}).state("phenotype",{url:"/phenotypes/:phenotypeId",controller:"PhenotypeCtrl",templateUrl:"views/phenotype.html"}).state("phenotype.edit",{url:"/edit"}).state("phenotypes",{url:"/phenotypes",controller:"PhenotypesCtrl",templateUrl:"views/phenotypes.html"})}]),angular.module("hpoApp").controller("MainCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("hpoApp").controller("PhenotypesCtrl",["$scope","Phenotype","promiseTracker","pageService",function(a,b,c,d){function e(){d.setTitle("Phenotypes");var b=g(a.page++);a.loadingTracker.addPromise(b)}function f(){var b=g(a.page++);a.loadingTracker.addPromise(b)}function g(c){return b.query({fields:"nid,concept_label",page:c},function(b){a.phenotypes=a.phenotypes||[],a.phenotypes=a.phenotypes.concat(b)})}a.loadMore=f,a.loadingTracker=c(),a.page=0,e(),console.log("phenotypes ctrl")}]),angular.module("hpoApp").factory("Phenotype",["$resource","$q","$http","ENV","Synonym",function(a,b,c,d,e){function f(a){return a.body="An HPO summary for this concept is currently under development.",a.concept_parent=_.map(a.concept_parent,function(a){return new h(a)}),a.concept_synonym=_.map(a.concept_synonym,function(a){return new e(a)}),a}function g(){var a=this,c=_.map(this.concept_parent,function(a){return a.id||a.nid});if(!c||!c.length)return b.when([]);var d=_.indexBy(c,function(a,b){return"parameters[nid]["+b+"]"});return d.fields=["nid","concept_label","concept_parent"].join(","),h.query(d).$promise.then(function(b){a.concept_parent=b})}console.log("ENV",d);var h=a(d.apiEndpoint+"/entity_node/:nid",{"parameters[type]":"hpo_concept",nid:"@nid"},{get:{method:"GET",transformResponse:c.defaults.transformResponse.concat([f])}});return h.prototype.getParents=g,h}]),angular.module("hpoApp").filter("inSlicesOf",["$rootScope",function(a){console.log("staring in slice of!!");var b=function(b,c){if(c||(c=3),!angular.isArray(b)&&!angular.isString(b))return b;for(var d=[],e=0;e<b.length;e++){var f=parseInt(e/c,10),g=e%c===0;g&&(d[f]=[]),d[f].push(b[e])}a.arraysinSliceOf=a.arraysinSliceOf||[];var h=null;return angular.forEach(a.arraysinSliceOf,function(a){angular.equals(a,d)&&(h=a)}),h?h:(a.arraysinSliceOf.push(d),d)};return b}]),angular.module("hpoApp").controller("PhenotypeCtrl",["$scope","$stateParams","promiseTracker","Phenotype","pageService","$state","modalService","$log",function(a,b,c,d,e,f,g,h){function i(){e.setTitle("Loading...");var c=d.get({nid:b.phenotypeId},function(a){r.phenotype=a,e.setTitle(a.concept_label),h.debug(r.phenotype)}).$promise;a.loadingTracker.addPromise(c)}function j(a){r.isEditing=a,a?f.go("phenotype.edit"):(console.log("go to phentoype"),f.go("phenotype"))}function k(a){a.isShowingParents=!a.isShowingParents,a.isShowingParents&&a.getParents()}function l(a){h.debug("go to phenotype",a),r.isEditing||f.go("phenotype",{phenotypeId:a})}function m(){return g.openEditChildren(r.phenotype)}function n(){return g.openEditClassification(r.phenotype)}function o(){return g.openEditTitle(r.phenotype)}function p(){return g.openEditDescription(r.phenotype)}function q(a){return g.openEditSynonym(r.phenotype,a)}var r=a;r.loadingTracker=c(),r.phenotype=null,r.toggleParents=k,r.isEditing=!1,r.editBody=p,r.editTitle=o,r.editClassification=n,r.changeEditing=j,r.editSynonym=q,r.editChildren=m,r.goToPhenotype=l,i()}]),angular.module("hpoApp").controller("SuggestionCtrl",["$stateParams","transactionStatusService","TransactionRequest","$state","$http","toaster","ENV","$log",function(a,b,c,d,e,f){function g(){b.loadStatusCodes().then(function(){return h()})}function h(){return c.get({nid:a.suggestionId}).$promise.then(function(a){return k.suggestion=a,a.loadTransactions()})}function i(a){a.tr_status=b.acceptedNid,a.$update().then(function(){f.pop("success","Suggestion Accepted"),d.go("suggestions")})}function j(a){a.tr_status=b.rejectedNid,a.$update().then(function(){f.pop("success","Suggestion Rejected"),d.go("suggestions")})}var k=this;k.suggestion=null,k.accept=i,k.reject=j,k.statues=null,k.isOpen=!1,g()}]),angular.module("hpoApp").controller("SuggestionsCtrl",["$http","$scope","ENV","TransactionRequest","$log","$q","transactionStatusService",function(a,b,c,d,e,f,g){function h(){g.loadStatusCodes().then(function(){i().then(function(a){l.openSuggestions=a,l.suggestions=l.openSuggestions}),j().then(function(a){l.closedSuggestions=a})})}function i(){return d.getSubmittedTransactions()}function j(){return d.getClosedTransactions()}function k(a){l.suggestions=null,l.suggestions=a?l.openSuggestions:l.closedSuggestions}var l=this;l.suggestions=null,l.openSuggestions=null,l.closedSuggestions=null,l.isShowingOpen=!0,l.statuses=null,l.suggestionTypeChanged=k,h()}]),angular.module("hpoApp").factory("Synonym",["$resource","ENV","$http","$log",function(a,b,c,d){function e(){var a=this;return d.debug("synonymn",a),c.get(b.apiEndpoint+"/entity_node/"+a.synonym_type.id).then(function(b){return a.synonym_type=b.data,a})}console.log("ENV",b);var f=a(b.apiEndpoint+"/entity_node/:nid",{"parameters[type]":"hpo_synonym",nid:"@nid"});return f.prototype.loadType=e,f}]),angular.module("hpoApp").factory("searchService",["ENV","$http","$state","Phenotype",function(a,b,c,d){function e(c){var d=encodeURIComponent(c),e=a.apiEndpoint+"/search_node/retrieve.json?keys="+d+"&simple=1";return b.get(e).then(function(a){return a.data})}function f(c){var e=a.apiEndpoint+"/entity_node";return b.get(e,{params:{"parameters[title]":c+"*","parameters[type]":"hpo_concept",field:"nid,title"}}).then(function(a){return _.map(a.data,function(a){return new d(a)})})}function g(a){var b={phenotypeId:a.nid};c.go("phenotype",b)}var h={getResults:e,findPhenotypes:f,changed:g};return h}]),angular.module("hpoApp").factory("pageService",function(){function a(a){b.title=a+" - HPO"}var b={title:null,setTitle:a};return b}),angular.module("hpoApp").factory("ListTransaction",["$resource","ENV","$http","$q","$state","$log",function(a,b,c,d,e,f){function g(){var a=this;return a.title="Loading...",a.isRefChange=a.ltrans_svalref?!0:!1,d.all([h(a),i(a),j(a)]).then(function(){if("add"===a.ltrans_ctype){var b=e.href("phenotype",{phenotypeId:a.ltrans_svalref.nid});a.description="Add <strong>"+a.ltrans_onprop+'</strong>: <a href="'+b+'">'+a.ltrans_svalref.title+"</a>"}else if("remove"===a.ltrans_ctype){var c=e.href("phenotype",{phenotypeId:a.ltrans_svalref.nid});a.description="Remove <strong>"+a.ltrans_onprop+'</strong>: <a href="'+c+'">'+a.ltrans_svalref.title+"</a>"}else a.ltrans_svalref?(f.debug("on prop",a.ltrans_svalref),a.description="Change <strong>"+a.ltrans_onprop+"</strong>: "+a.ltrans_cvalref.title+" to "+a.ltrans_svalref.title):a.ltrans_svalplain?(f.debug("on prop",a.ltrans_svalplain),a.description="Change <strong>"+a.ltrans_onprop+"</strong>:<br/>"+a.ltrans_cvalplain+'<br/><i class="fa fa-arrow-down"></i><br/>'+a.ltrans_svalplain):f.error("List transactions not working");return a})}function h(a){var d=a.ltrans_onnode,e={fields:"nid,title,type,disgene_disorder,disgene_gene,ds_sign,ds_disorder"};return c.get(b.apiEndpoint+"/entity_node/"+d,{params:e}).then(function(b){a.ltrans_onnode=b.data})}function i(a){var e=a.ltrans_svalref;if(!e)return d.when(!1);var f={fields:"nid,title"};return c.get(b.apiEndpoint+"/entity_node/"+e,{params:f}).then(function(b){a.ltrans_svalref=b.data})}function j(a){var e=a.ltrans_cvalref;if(!e)return d.when(!1);var f={fields:"nid,title"};return c.get(b.apiEndpoint+"/entity_node/"+e,{params:f}).then(function(b){a.ltrans_cvalref=b.data})}function k(){return this.ltrans_onnode}var l=a(b.apiEndpoint+"/entity_node/:nid",{"parameters[type]":"list_transaction",nid:"@nid"});return l.prototype.loadReferences=g,l.prototype.getOnNode=k,l}]),angular.module("hpoApp").factory("TransactionRequest",["$resource","$http","$log","ENV","ListTransaction","transactionStatusService","$q","ListTransactionUnlimited","$state",function(a,b,c,d,e,f,g,h,i){function j(){return f.loadStatusCodes().then(function(){return m(f.submittedNid)})}function k(){return f.loadStatusCodes().then(function(){return g.all([m(f.rejectedNid),m(f.acceptedNid)]).then(function(a){return _.flatten(a)})})}function l(){var a=this;if(a.$isOpen=f.isSubmitted(a.$tr_status.nid),a.$tr_trans.length){var b=_.map(a.$tr_trans,function(a){return a.loadReferences()});return g.all(b).then(function(){var b=a.$tr_trans[0];c.debug("on node",b.getOnNode());var d=i.href("phenotype",{phenotypeId:b.getOnNode().nid});a.$onNodeDescription='<a href="'+d+'">'+b.getOnNode().title+"</a>"})}}function m(a){return q.query({"parameters[tr_status]":a,fields:"nid,title,tr_status,tr_timestamp,tr_user,tr_trans,created,author,changed"}).$promise.then(function(a){return a},function(){return[]})}function n(a){return a.tr_trans=_.map(a.tr_trans,function(a){return"list_transaction"===a.type?new e(a):"list_transaction_unlimited"===a.type?new h(a):void 0}),p(a,"tr_trans"),p(a,"tr_user"),p(a,"author"),p(a,"source"),p(a,"tr_status"),a}function o(a){return _.each(a,function(a){n(a)}),a}function p(a,b){a["$"+b]=a[b],delete a[b]}var q=a(d.apiEndpoint+"/entity_node/:nid",{"parameters[type]":"transaction_request",nid:"@nid"},{get:{method:"GET",transformResponse:b.defaults.transformResponse.concat([n])},query:{method:"GET",isArray:!0,transformResponse:b.defaults.transformResponse.concat([o])},update:{method:"PUT"}});return q.prototype.loadTransactions=l,q.getSubmittedTransactions=j,q.getClosedTransactions=k,q}]),angular.module("hpoApp").factory("modalService",["$modal",function(a){function b(b,c){var d={synonym:c,phenotype:b};return a.open({templateUrl:"views/editsynonym.modal.html",controller:"EditSynonymCtrl as vm",resolve:{config:function(){return d}}})}function c(b){var c={concept:b,propertyName:"title",propertyLabel:"Disorder Name"};return a.open({templateUrl:"views/edittitle.modal.html",controller:"EditTitleCtrl as vm",resolve:{config:function(){return c}}})}function d(b){var c={concept:b,infoMessage:"Add or remove children from "+b.title,propertyName:"concept_child",transactionRequestTitle:b.title+" - Update Children"};return a.open({templateUrl:"views/editclassification.modal.html",controller:"EditChildrenCtrl as vm",resolve:{config:function(){return c}}})}function e(b){var c={concept:b,infoMessage:"Add or remove parent from "+b.title,propertyName:"concept_parent",transactionRequestTitle:b.title+" - Update Parent Hierarchy"};return a.open({templateUrl:"views/editclassification.modal.html",controller:"EditChildrenCtrl as vm",resolve:{config:function(){return c}}})}function f(b){var c={concept:b,propertyName:"body",propertyLabel:"Description"};return a.open({templateUrl:"views/editbody.modal.html",controller:"EditTitleCtrl as vm",resolve:{config:function(){return c}}})}function g(a){return j(a,"Prevalence Class","disorder_prevalence","prevalence_class")}function h(a){return j(a,"Age of Onset","disorder_onset","age_of_onset")}function i(a){return j(a,"Age of Death","disorder_death","age_of_death")}function j(b,c,d,e){var f={concept:b,propertyLabel:c,propertyName:d,propertyContentType:e};return a.open({templateUrl:"views/edit.modal.html",controller:"EditModalCtrl as editVm",resolve:{config:function(){return f}}})}var k={openPrevalenceClassModal:g,openAgeOfOnset:h,openAgeOfDeath:i,openEditTitle:c,openEditDescription:f,openEditClassification:e,openEditChildren:d,openEditSynonym:b};return k}]),angular.module("hpoApp").controller("EditTitleCtrl",["$scope","$http","$modalInstance","ENV","ListTransaction","config","TransactionRequest","$log","toaster",function(a,b,c,d,e,f,g,h,i){function j(){k()}function k(){return b.get(d.apiEndpoint+"/entity_node?parameters[type]=tr_status").then(function(a){n.statuses=a.data,h.debug("loading statuses",n.statuses)})}function l(){var a=_.find(n.statuses,{title:"Submitted"});if(!a)return void h.error("couldnt find submitted status");var b=new e({title:n.concept.title,type:"list_transaction",ltrans_position:0,ltrans_onnode:n.concept.nid,ltrans_onprop:n.propertyName,ltrans_svalplain:n.propertyValue,ltrans_cvalplain:n.concept[n.propertyName].substring(0,500),body:{value:n.reason,summary:n.reason}});b.$save().then(function(){var c=new g({title:n.concept.title+" - "+n.propertyLabel,type:"transaction_request",tr_timestamp:(new Date).getTime()/1e3,tr_trans:[b.nid],tr_status:a.nid,tr_user:0,body:{value:n.reason,summary:n.reason}});return i.pop("success","Suggestion submitted."),c.$save()}),c.close()}function m(){c.dismiss("cancel")}var n=this;n.concept=f.concept,n.propertyName=f.propertyName,n.propertyLabel=f.propertyLabel,n.propertyValue=n.concept[n.propertyName].substring(0,400),n.save=l,n.statuses=null,n.cancel=m,n.reason="",j()}]),angular.module("hpoApp").controller("EditSynonymCtrl",["$scope","$http","$modalInstance","config","ENV","ListTransaction","$q","TransactionRequest","toaster","$log",function(a,b,c,d,e,f,g,h,i,j){function k(){l()}function l(){return b.get(e.apiEndpoint+"/entity_node?parameters[type]=tr_status").then(function(a){o.statuses=a.data,j.debug("loading statuses",o.statuses)})}function m(){j.debug("savuing!");var a=_.find(o.statuses,{title:"Submitted"});if(!a)return void j.error("couldnt find submitted status");var b=new f({title:o.phenotype.title,type:"list_transaction",ltrans_position:0,ltrans_onnode:o.synonym.nid,ltrans_onprop:"title",ltrans_svalplain:o.synonymName,ltrans_cvalplain:o.synonym.title.substring(0,500),body:{value:o.reason,summary:o.reason}});b.$save().then(function(){var c=new h({title:o.phenotype.title+" - Synonym",type:"transaction_request",tr_timestamp:(new Date).getTime()/1e3,tr_trans:[b.nid],tr_status:a.nid,tr_user:0,body:{value:o.reason,summary:o.reason}});return i.pop("success","Suggestion submitted."),c.$save()}),c.close()}function n(){c.dismiss("cancel")}var o=this;o.synonym=d.synonym,o.phenotype=d.phenotype,o.reason=null,o.types=null,o.synonymName=o.synonym.title,o.cancel=n,o.save=m,k()}]),angular.module("hpoApp").factory("ListTransactionUnlimited",["$resource","ENV","$q","$state",function(a,b,c,d){function e(){var a=d.href("phenotypes");return this.test='<b>This is a test</b><a href="'+a+'">hello world</a>',c.when(this)}function f(){return this.ltransu_onnode}var g=a(b.apiEndpoint+"/entity_node/:nid",{"parameters[type]":"list_transaction_unlimited",nid:"@nid"});return g.prototype.loadReferences=e,g.prototype.getOnNode=f,g}]),angular.module("hpoApp").controller("EditClassificationCtrl",["transactionStatusService","$log","config","Phenotype","searchService","TransactionRequest","ListTransaction","toaster","$modalInstance","$q",function(a,b,c,d,e,f,g,h,i,j){function k(){return l()}function l(){return a.loadStatusCodes()}function m(a){e.findPhenotypes(a).then(function(a){p(a)})}function n(a){r.parents.push(a),r.newParent=null,p(r.phenotypes)}function o(a,b){var c=b.indexOf(a);b.splice(c,1),m("")}function p(a){r.phenotypes=_.reject(a,function(a){return _.find(r.parents,{nid:a.nid})||r.phenotype.nid===a.nid})}function q(){r.addedParents=_.reject(r.parents,function(a){return _.find(r.phenotype.concept_parent,{nid:a.nid})}),r.removedParents=_.reject(r.phenotype.concept_parent,function(a){return _.find(r.parents,{nid:a.nid})}),r.addedParentsRequests=_.map(r.addedParents,function(a){var b=new g({title:"transaction",type:"list_transaction",ltrans_onnode:r.phenotype.nid,ltrans_onprop:"concept_parent",ltrans_ctype:"add",ltrans_svalref:a.nid});return b.$save()}),r.removeParentRequests=_.map(r.removedParents,function(a){var b=new g({title:"transaction",type:"list_transaction",ltrans_onnode:r.phenotype.nid,ltrans_onprop:"concept_parent",ltrans_ctype:"remove",ltrans_svalref:a.nid});return b.$save()});var b=r.addedParentsRequests.concat(r.removeParentRequests);j.all(b).then(function(b){var c=new f({title:r.phenotype.title+" - Update Parent Hierarchy",type:"transaction_request",tr_timestamp:(new Date).getTime()/1e3,tr_trans:_.pluck(b,"nid"),tr_status:a.submittedNid,tr_user:0,body:{value:r.reason+"",summary:r.reason+""}});return h.pop("success","Suggestion submitted."),c.$save()}),i.dismiss("cancel")}var r=this;r.config=c,r.phenotype=c.concept;var s="Add or remove children from "+r.phenotype.title;r.message=s,r.reason="",r.parents=_.clone(r.phenotype.concept_parent),r.phenotypes=null,r.refreshPhenotypes=m,r.addParent=n,r.removeParent=o,r.newParent=null,r.save=q,k()}]),angular.module("hpoApp").factory("TransactionStatus",["$resource","$http","ENV","ListTransaction",function(a,b,c){var d=a(c.apiEndpoint+"/entity_node/:nid",{"parameters[type]":"tr_status",nid:"@nid"});return d}]),angular.module("hpoApp").factory("transactionStatusService",["$http","ENV","$log",function(a,b,c){function d(){return a.get(b.apiEndpoint+"/entity_node",{params:{"parameters[type]":"tr_status"}}).then(function(a){h=a.data,i.submittedNid=_.find(h,{title:"Submitted"}).nid,i.acceptedNid=_.find(h,{title:"Accepted"}).nid,i.rejectedNid=_.find(h,{title:"Rejected"}).nid,c.debug("Submitted NID",i.submittedNid)})}function e(a){return a===i.acceptedNid}function f(a){return a===i.rejectedNid}function g(a){return a===i.submittedNid}var h=null,i={loadStatusCodes:d,isAccepted:e,isRejected:f,isSubmitted:g,acceptedNid:null,rejectedNid:null,submittedNid:null};return i}]),angular.module("hpoApp").factory("propertyLabelService",function(){var a={concept_parent:"Parent"};return a}),angular.module("hpoApp").controller("EditChildrenCtrl",["transactionStatusService","$log","config","Phenotype","searchService","TransactionRequest","ListTransaction","toaster","$modalInstance","$q",function(a,b,c,d,e,f,g,h,i,j){function k(){return l()}function l(){return a.loadStatusCodes()}function m(a){e.findPhenotypes(a).then(function(a){p(a)})}function n(a){s.parents.push(a),s.newParent=null,p(s.phenotypes)}function o(a,b){var c=b.indexOf(a);b.splice(c,1),m("")}function p(a){s.phenotypes=_.reject(a,function(a){return _.find(s.parents,{nid:a.nid})||s.phenotype.nid===a.nid})}function q(){i.dismiss("cancel")}function r(){s.addedParents=_.reject(s.parents,function(a){return _.find(s.phenotype[s.propertyName],{nid:a.nid})}),s.removedParents=_.reject(s.phenotype[s.propertyName],function(a){return _.find(s.parents,{nid:a.nid})}),s.addedParentsRequests=_.map(s.addedParents,function(a){var b=new g({title:"transaction",type:"list_transaction",ltrans_onnode:s.phenotype.nid,ltrans_onprop:s.propertyName,ltrans_ctype:"add",ltrans_svalref:a.nid});return b.$save()}),s.removeParentRequests=_.map(s.removedParents,function(a){var b=new g({title:"transaction",type:"list_transaction",ltrans_onnode:s.phenotype.nid,ltrans_onprop:s.propertyName,ltrans_ctype:"remove",ltrans_svalref:a.nid});return b.$save()});var b=s.addedParentsRequests.concat(s.removeParentRequests);j.all(b).then(function(b){var c=new f({title:s.transactionRequestTitle,type:"transaction_request",tr_timestamp:(new Date).getTime()/1e3,tr_trans:_.pluck(b,"nid"),tr_status:a.submittedNid,tr_user:0,body:{value:s.reason+"",summary:s.reason+""}});return h.pop("success","Suggestion submitted."),c.$save()}),i.dismiss("cancel")}var s=this;s.config=c,s.phenotype=c.concept,s.infoMessage=c.infoMessage,s.propertyName=c.propertyName,s.transactionRequestTitle=c.transactionRequestTitle,s.parents=_.clone(s.phenotype[s.propertyName]),s.phenotypes=null,s.reason="",s.refreshPhenotypes=m,s.addParent=n,s.removeParent=o,s.newParent=null,s.save=r,s.cancel=q,k()}]),angular.module("hpoApp").directive("cmSref",["$state","$log",function(a){function b(b,d,e){var f=c(e.cmSref,a.current.name),g=function(c){d[0].href=c?"":a.href(f.state,b.$eval(f.paramExpr))};b.$watch("isEditing",g),g()}function c(a,b){var c,d=a.match(/^\s*({[^}]*})\s*$/);if(d&&(a=b+"("+d[1]+")"),c=a.replace(/\n/g," ").match(/^([^(]+?)\s*(\((.*)\))?$/),!c||4!==c.length)throw new Error("Invalid state ref '"+a+"'");return{state:c[1],paramExpr:c[3]||null}}var d={restrict:"A",link:b};return d}]);