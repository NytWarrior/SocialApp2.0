<link rel="stylesheet" href="/css/post.css">
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
        </div > 