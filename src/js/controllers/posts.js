angular
  .module('sausageApp')
  .controller('PostsIndexCtrl', PostsIndexCtrl)
  .controller('PostsNewCtrl', PostsNewCtrl)
  .controller('PostsShowCtrl', PostsShowCtrl)
  .controller('PostsEditCtrl', PostsEditCtrl);

PostsIndexCtrl.$inject = ['Post', 'filterFilter', '$scope'];
function PostsIndexCtrl(Post, filterFilter, $scope){
  const vm = this;
  Post.query((posts) => {
    vm.all = posts;
    filterPosts();
  });

  function filterPosts(){
    const params = { title: vm.q };
    vm.filtered = filterFilter(vm.all, params);
  }

  $scope.$watchGroup([
    () => vm.q
  ], filterPosts);

}

PostsNewCtrl.$inject = ['Post', '$state'];
function PostsNewCtrl(Post, $state) {
  const vm = this;
  vm.post = {
    items: []
  };

  function postsCreate() {
    if (vm.postForm.$valid) {
      Post
        .save(vm.post)
        .$promise
        .then(() => $state.go('postsIndex'));
    }
  }

  vm.create = postsCreate;

  function addItem() {
    console.log(vm.newItem);
    vm.post.items.push(vm.newItem);
    vm.newItem = {};
  }

  vm.addItem = addItem;

  function deleteItem(item) {
    const itemsIndex = vm.post.comments.indexOf(item);
    vm.post.items.splice(itemsIndex, 1);
  }

  vm.deleteItem = deleteItem;

}

PostsShowCtrl.$inject = ['Post', 'PostComment', '$stateParams', '$state'];
function PostsShowCtrl(Post, PostComment, $stateParams, $state) {
  const vm = this;
  vm.newComment = {};
  vm.post = Post.get($stateParams);

  function postsDelete() {
    vm.post
      .$remove()
      .then(() => $state.go('postsIndex'));
  }

  vm.delete = postsDelete;


  function addComment(){
    PostComment
    .save({ postId: vm.post.id }, vm.newComment )
    .$promise
    .then((comment) => {
      vm.post.comments.push(comment);
      vm.newComment = {};
    });
  }
  vm.addComment = addComment;

  function deleteComment(comment){
    PostComment
    .delete({ postId: vm.post.id, id: comment.id })
    .$promise
    .then(() => {
      const index = vm.post.comments.indexOf(comment);
      vm.post.comments.splice(index, 1);
    });
  }
  vm.deleteComment = deleteComment;

}

PostsEditCtrl.$inject = ['Post', '$stateParams', '$state'];
function PostsEditCtrl(Post, $stateParams, $state) {
  const vm = this;

  vm.post = Post.get($stateParams);

  function postsUpdate() {
    if (vm.postForm.$valid) {
      vm.post
        .$update()
        .then(() => $state.go('postsShow', $stateParams));
    }
  }

  vm.update = postsUpdate;
}
