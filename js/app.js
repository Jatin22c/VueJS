window.Event = new Vue();

//User Table Header
const Users = {
	template: `
		<table class="table table-responsive-sm table-hover table-outline mb-0">
          <thead class="thead-light">
            <tr>
              <th class="text-center">
                <i class="icon-people"></i>
              </th>
              <th>User</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Website</th>
              <th>Company</th>
            </tr>
          </thead>
          <user v-for="user in users" :key="user.id" :row="user"></user>
        </table>
      `,
      props: ['users'],
};


//User Table Body
const User = {
	template: `
		<tr>
			<td>
				{{ row.id }}
			</td>
			<td><a href="#" data-toggle="modal" data-target="#myModal" @click.prevent="toggleModal(row)">{{ row.name }}</a>
				<div></div>
				<div class="small text-muted">
				  <span>{{ row.username }}</span> | {{ row.email }}</div>
			</td>
			<td>
				<div>{{ row.address.street + ", " + row.address.suite }}</div>
				<div class="small text-muted">
				  <span>{{ row.address.city }}</span> | {{ row.address.zipcode }}</div>
			</td>
			<td>
				<div>{{ row.phone }}</div>
			</td>
			<td>
				<div>{{ row.website }}</div>
			</td>
			<td>
				<div>{{ row.company.name }}</div>
				<div class="small text-muted">{{ row.company.catchPhrase }}</div>
			</td>
        </tr>
	`,
	props: ['row'],
	methods: {
		toggleModal(row){
			Event.$emit('toggleModal',row);
		}
	}
};


//Posts Modal
const UserModal = {
  template: `
      <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title" id="myModalLabel">{{ modal.name }}'s Posts</h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                
              </div>
              <div class="modal-body">
                  <div class="small text-muted">10 recent posts</div><br>
                  <user-posts :userid="modal.id" v-if="showPosts" :key="modal.id"></user-posts>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      `,
  data() {
    return {
      modal: false,
      userid: 0,
      showPosts: false,
    }
  },
  created() {
    Event.$on('toggleModal', (row) => {
      this.modal = row;
      this.showPosts = true;
    })
  }
}

//Post Listing
const UserPosts = {
  template: `
    <div id="accordion">
      <div class="group" v-for="post,index in posts">
        <h3 class="post-block"><a class="post-links" data-toggle="collapse" :href="'#collapse' + post.id" role="button" aria-expanded="false" aria-controls="collapseExample"><span class="post-no">Post #{{ index + 1 }}</span><p class="post-title">{{ post.title | capitalize }}</p></a></h3>
        <div class="collapse card card-body" :id="'collapse' + post.id">
          <p class="post-desc">{{ post.body | | capitalize}}</p>
        </div>
      </div>
    </div>
  `,
  props: ['userid','showPosts'],
  data(){
    return {
        postNo: 1,
        posts: null,
        showPosts: this.showPosts,
    }
  },
  mounted () {
    axios
      .get('https://jsonplaceholder.typicode.com/posts?userId='+this.userid)
      .then(response => (this.posts = response.data))
  }
};

Vue.component('users', Users);
Vue.component('user', User);
Vue.component('user-modal', UserModal);
Vue.component('user-posts', UserPosts);

Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})


new Vue({
    el: '#app',
    data: {
        users: null
    },
    mounted () {
    axios
      .get('https://jsonplaceholder.typicode.com/users')
      .then(response => (this.users = response.data))
  }
});
