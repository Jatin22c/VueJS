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
			<td><span data-toggle="tooltip" data-placement="top" title="Name"><a data-toggle="modal" href="#myModal" @click.prevent="toggleModal(row)">{{ row.name }}</a></span>
				<div></div>
				<div class="small text-muted">
				  <span data-toggle="tooltip" data-placement="bottom" title="Username">{{ row.username }}</span> | <span data-toggle="tooltip" data-placement="bottom" title="Email"><a :href="'mailto:' + row.email">{{ row.email }}</a></span></div>
			</td>
			<td>
				<div><span data-toggle="tooltip" data-placement="top" title="Street Address">{{ row.address.street + ", " + row.address.suite }}</span></div>
				<div class="small text-muted">
				  <span data-toggle="tooltip" data-placement="bottom" title="City">{{ row.address.city }}</span> | <span data-toggle="tooltip" data-placement="bottom" title="Zipcode">{{ row.address.zipcode }}</span></div>
			</td>
			<td>
				<div><span data-toggle="tooltip" data-placement="top" title="Phone Number">{{ row.phone }}</span></div>
			</td>
			<td>
				<div><a data-toggle="tooltip" data-placement="top" title="Website" :href="'http://'+row.website" target="_blank">{{ row.website }}</a></div>
			</td>
			<td>
				<div><span data-toggle="tooltip" data-placement="top" title="Company Name">{{ row.company.name }}</span></div>
				<div class="small text-muted"><span data-toggle="tooltip" data-placement="bottom" title="Catch Phrase">{{ row.company.catchPhrase }}</span></div>
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
                <a href="javascript:;" onclick="closeModal();" class="btn"><span aria-hidden="true">&times;</span></a>
                
              </div>
              <div class="modal-body">
                  <div class="small text-muted">10 recent posts</div><br>
                  <user-posts :userid="modal.id" v-if="showPosts" :key="modal.id"></user-posts>
              </div>
              <div class="modal-footer">
                <a href="js:;" onclick="closeModal();" class="btn">Close</a>
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
        <h3 class="post-block"><a class="post-links" data-toggle="modal" :href="'#myPost' + post.id" @click.prevent=""><span class="post-no">Post #{{ index + 1 }}</span><p class="post-title">{{ post.title | capitalize }}</p></a></h3>
        <div class="modal fade" :id="'myPost' + post.id" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
          <div class="modal-dialog post-modal" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title" id="myModalLabel">{{ post.title | | capitalize }}</h4>
                <a href="javascript:;" onclick="closePost();" class="btn"><span aria-hidden="true">&times;</span></a>  
              </div>
              <div class="modal-body" :key="post.id">
                  <p class="post-desc">{{ post.body | | capitalize}}</p>
              </div>
              <div class="modal-footer">
                <a href="js:;" onclick="closePost();" class="btn">Close</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  props: ['userid', 'showPosts'],
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
//Vue.component('view-post', ViewPost);

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
