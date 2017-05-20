/**
 * This file contains all necessary Angular controller definitions for 'frontend.admin.login-history' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function() {
  'use strict';

  angular.module('frontend.consumers')
    .controller('ConsumersController', [
      '_','$scope', '$log', '$state','ConsumerService','$q','MessageService',
        'RemoteStorageService','UserService','SocketHelperService',
        '$uibModal','DialogService','ConsumerModel','ListConfig',
      function controller(_,$scope, $log, $state, ConsumerService,$q,MessageService,
                          RemoteStorageService,UserService,SocketHelperService,
                          $uibModal,DialogService,ConsumerModel,ListConfig ) {

          ConsumerModel.setScope($scope, false, 'items', 'itemCount');
          $scope = angular.extend($scope, angular.copy(ListConfig.getConfig('consumer',ConsumerModel)));
          $scope.user = UserService.user();
          $scope.importConsumers = importConsumers
          $scope.openCreateConsumerModal = openCreateConsumerModal



          function importConsumers() {
              $uibModal.open({
                  animation: true,
                  ariaLabelledBy: 'modal-title',
                  ariaDescribedBy: 'modal-body',
                  templateUrl: 'js/app/consumers/import/modal-select-storage.html',
                  controller: 'ImportConsumersStorageController',
                  controllerAs: '$ctrl',
                  resolve : {
                      _adapters : function() {
                          return RemoteStorageService.loadAdapters();
                      }
                  }
              });
          }



          function openCreateConsumerModal() {
              $uibModal.open({
                  animation: true,
                  ariaLabelledBy: 'modal-title',
                  ariaDescribedBy: 'modal-body',
                  templateUrl: 'js/app/consumers/create-consumer-modal.html',
                  controller: function($scope,$rootScope,$log,$uibModalInstance,MessageService,ConsumerService){

                      $scope.consumer = {
                          username  : '',
                          custom_id : ''
                      }

                      $scope.close = close
                      $scope.submit = submit

                      function submit(){
                          ConsumerService.create($scope.consumer)
                              .then(function(res){
                                  MessageService.success("Consumer created successfully!")
                                  $rootScope.$broadcast('consumer.created',res.data)
                                  close()
                              }).catch(function(err){
                                $log.error("Failed to create consumer", err)
                                $scope.errors = err.data.customMessage || {}
                          })
                      }

                      function close() {
                          $uibModalInstance.dismiss()
                      }
                  },
                  controllerAs: '$ctrl',
              });
          }


          function _fetchData() {

              $scope.loading = true;
              ConsumerModel.load({
                  size : $scope.itemsFetchSize
              }).then(function(response){
                  $scope.items = response;
                  $scope.loading= false;
              })
          }



          $scope.$on('consumer.created',function(ev,user){
              _fetchData()
          })


          $scope.$on('consumer.updated',function(ev,user){
              _fetchData()
          })

          $scope.$on('credentials.assigned',function(ev,user){
              _fetchData()
          })

          $scope.$on('search',function(ev,user){
              _fetchData()
          })

          $scope.$on('user.node.updated',function(node){
              _fetchData()
          })

          _fetchData()

      }
    ])
}());
