{
    // method to submit the form data for new post using AJAX
    let createPost = function () {
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function (e) {
            e.preventDefault();
            const form = new FormData(newPostForm[0]);
            $.ajax({
                type: 'POST',
                url: '/posts/create',
                // data: newPostForm.serialize(),
                // -----------------------------------
                //**** Used with Multipart Form ****//
                enctype: "multipart/form-data",
                processData: false, // Important!
                contentType: false, // Important!
                cache: false,
                data: form,
                success: function (data) {
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>div').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));

                    // call the create comment class
                    new PostComments(data.data.post._id);

                    new ToggleLike($(' .toggle-like-button', newPost));

                    new Noty({
                        theme: 'relax',
                        text: "Post published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500

                    }).show();
                    newPostForm.trigger("reset");

                }, error: function (error) {
                    console.log(error.responseText);
                }
            });
        });
    }


    // method to create a post in DOM
    let newPostDom = function (post) {
        let postImage, postVideo;
        try {
            if (post.image !== "") {
                postImage = `<img src="${post.image}" alt="alt-post-image" />`;
            } else {
                postImage = "";
            }

            if (post.video !== "") {
                postVideo = `<video src="${post.video}" alt="alt-post-video" controls />`;
            } else {
                postVideo = "";
            }
        } catch (error) {
            console.log("error", error);
        }

        return $(`<link rel="stylesheet" href="/css/post.css">
        <div class=" gedf-main" id="post-${post._id}">
                    <div class="card gedf-card">
                        <div class="card-header">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="mr-2">
                                        <img class="rounded-circle" width="45" src="${post.user.avatar}" alt="">
                                    </div>
                                    <div class="ml-2">
                                        <div class="h5 m-1">
                                        ${post.user.name}
                                        </div>
                                        <div class="h7 text-muted">Location</div>
                                    </div>
                                </div>
                                <div>
                                        <div class="dropdown">
                                            <button class="btn btn-link dropdown-toggle" type="button" id="gedf-drop1"
                                                data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i class="fa fa-ellipsis-h"></i>
                                            </button>
                                            <div class="dropdown-menu" aria-labelledby="gedf-drop1">
                                                <!-- <div class="h6 dropdown-header">Configuration</div> -->
                                                <a class="delete-post-button dropdown-item"
                                                    href="/posts/destroy/${post._id}">Delete</a>
                                            </div>

                                        </div>
                                </div>
                            </div>

                        </div>
                        <div class="card-body">

                            <p class="card-title">
                                ${post.content}
                            </p>

                            <p class=" card-image">
                            
                                `<% if (post.image) { %>
                                    <img class="img-fluid" src="${postImage}" alt="alt-post-image" loading="lazy" />
                                    <% } %>
                                        <% if (post.video) { %>
            <video class="img-fluid" src="${postVideo}" alt="alt-post-video" controls>
                <% } %>`
            </p>
                        </div >

                        <div class="card-footer" style="font-size: small;">
                                <a href="/likes/toggle/?id=${post._id}&type=Post " class="card-link toggle-like-button"
                                    data-likes="<%= post.likes.length %>"><i class="fa fa-gittip"></i>
                                    <%= post.likes.length %> Like
                                </a>

                                <a class="card-link" data-bs-toggle="collapse" href="#collapseExample-${post._id}">
                                    <i class="fa fa-comment-alt"></i>Comment
                                </a>
                
                                    <!-- <a href="#" class="card-link"><i class="fa fa-mail-forward"></i> Share</a> -->
                        </div>
                        <div class="collapse" id="collapseExample-${post._id}">
                            <div class="card border border-right-0 border-left-0 border-bottom-0 mt-1">
                                
                                <section class="mt-3">
                                    <form action="/comments/create" method="POST">
                                        <div class="input-group input-group">
                                            <input type="text" class="form-control" name="content" placeholder="Write Comment"
                                                aria-label="Recipient's username" aria-describedby="basic-addon2" required>
                                            <input type="hidden" name="post" value="${post._id}">
                                            <div class="input-group-append">
                                                <input class="text-decoration-none text-black btn btn-warning" type="submit"
                                                    value="Add Comment">
                                            </div>
                                        </div>
                                    </form>
                                </section>
                                <section>
                                    <div class="post-comments">
                                        <div class="post-comments-list">
                                            <ul id="post-comments-${post._id} ">
                                            </ul>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div > `)
    }


    // method to delete a post from DOM
    let deletePost = function (deleteLink) {
        $(deleteLink).click(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function (data) {
                    $(`#post - ${ data.data.post_id } `).remove();
                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500

                    }).show();
                }, error: function (error) {
                    console.log(error.responseText);
                }
            });

        });
    }





    // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
    let convertPostsToAjax = function () {
        $('#posts-list-container>div').each(function () {
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);

            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1]
            new PostComments(postId);
        });
    }



    createPost();
    convertPostsToAjax();
}