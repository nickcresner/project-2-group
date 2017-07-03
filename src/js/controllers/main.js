angular
  .module('sausageApp')
  .controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ['$rootScope', '$state', '$auth', '$transitions', 'User'];
function MainCtrl($rootScope, $state, $auth, $transitions, User) {
  const vm = this;

  vm.isAuthenticated = $auth.isAuthenticated;

  $rootScope.$on('error', (e, err) => {
    vm.message = err.data.message; //error coming from our API

    if(err.status === 401) {
      vm.stateHasChanged = false;
      $state.go('login');
    }
  });



  $transitions.onSuccess({}, (transition) => {
    vm.pageName = transition.$to().name;
    if(vm.stateHasChanged) vm.message = null;
    if(!vm.stateHasChanged) vm.stateHasChanged = true;
    if($auth.getPayload()) vm.currentUserId = $auth.getPayload().userId;
    // if($auth.getPayload()) vm.currentUserImage = $auth.getPayload().userImage; -- TO DISPLAY USER IMAGE IN NAV
    if($auth.getPayload()) {
      vm.currentUserId = $auth.getPayload().userId;
      vm.currentUser = User.get({ id: vm.currentUserId });
    }
    console.log('payload', $auth.getPayload());

  });

  function logout() {
    $auth.logout();
    $state.go('home'); //remember to create dashboard also where will the user be redirected after they logout ../
  }

  vm.logout = logout;
}
