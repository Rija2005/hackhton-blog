import { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,  signInWithPopup, doc, setDoc, collection, addDoc, serverTimestamp, query, orderBy, getDocs ,GoogleAuthProvider} from "./firebase.js";




//Sign Up Function
const signupForm = document.getElementById("signup-form");
if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("UserName").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save user data to Firestore
            await setDoc(doc(db, "users", user.uid), {
                username: username,
                email: email,
                createdAt: serverTimestamp(),
            });

            Swal.fire("Success", "Account created successfully!", "success");
            window.location.href = "login.html"; // Redirect to login page
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }
    });
}

const loginForm = document.getElementById("login-form");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (!email || !password) {
            Swal.fire("Error", "Please fill in both email and password.", "error");
            return;
        }

        try {
            // Sign in the user
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save login event details to Firestore
            const loginEventRef = collection(db, "loginEvents");
            await addDoc(loginEventRef, {
                email: user.email,
                timestamp: serverTimestamp(),
                userId: user.uid,
            });

            // Success message and redirection
            Swal.fire("Success", "Logged in successfully!", "success");
            window.location.href = "index.html"; // Redirect to homepage
        } catch (error) {
            console.log(error.message );
            
            // Swal.fire("Error", error.message, "error");
        }
    });
}


// Google Login
const googleLoginBtn = document.getElementById("google-login-btn");
if (googleLoginBtn) {
    googleLoginBtn.addEventListener("click", async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Save Google user data to Firestore
            await setDoc(doc(db, "users", user.uid), {
                username: user.displayName,
                email: user.email,
                createdAt: serverTimestamp(),
            });

            Swal.fire("Success", "Logged in with Google!", "success");
            window.location.href = "index.html"; // Redirect to homepage
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }
    });
}

// Logout Function
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        try {
            await signOut(auth);
            Swal.fire("Success", "Logged out successfully!", "success");
            window.location.href = "login.html"; // Redirect to login page
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }
    });
}

// Create Post Function (for dashboard)
// const createPostBtn = document.querySelector(".create-post-btn");
// if (createPostBtn) {
//     createPostBtn.addEventListener("click", async () => {
//         const { value: formValues } = await Swal.fire({
//             title: "Create Post",
//             html: `
//                 <input id="swal-title" class="swal2-input" placeholder="Post Title">
//                 <textarea id="swal-description" class="swal2-textarea" placeholder="Post Description"></textarea>
//             `,
//             focusConfirm: false,
//             showCancelButton: true,
//             confirmButtonText: "Add Post",
//             preConfirm: () => {
//                 const title = document.getElementById("swal-title").value;
//                 const description = document.getElementById("swal-description").value;
//                 if (!title || !description) {
//                     Swal.showValidationMessage("Both fields are required!");
//                     return false;
//                 }
//                 return { title, description };
//             },
//         });console.log(swal());
        

//         if (formValues) {
//             try {
//                 const user = auth.currentUser;
//                 if (user) {
//                     const postsRef = collection(db, "posts");
//                     await addDoc(postsRef, {
//                         userId: user.uid,
//                         username: user.displayName || "Anonymous", // Get username from user
//                         title: formValues.title,
//                         description: formValues.description,
//                         timestamp: serverTimestamp(),
//                     });
//                     Swal.fire("Post Added!", "Your post has been successfully added.", "success");
//                     displayPosts(); // Refresh posts
//                 }
//             } catch (error) {
//                 Swal.fire("Error", "Could not save the post. Please try again.", "error");
//                 console.error("Error saving post:", error);
//             }
//         }
//     });
// }
// Create Post Function (for dashboard)
const createPostBtn = document.querySelector(".create-post-btn");
if (createPostBtn) {
    createPostBtn.addEventListener("click", async () => {
        const { value: formValues } = await Swal.fire({
            title: "Create Post",
            html: `
                <input id="swal-title" class="swal2-input" placeholder="Post Title">
                <textarea id="swal-description" class="swal2-textarea" placeholder="Post Description"></textarea>
                <!-- Add radio buttons for selecting category -->
                <div>
                    <label><input type="radio" name="category" value="Technology"> Technology</label>
                    <label><input type="radio" name="category" value="General"> General</label>
                    <label><input type="radio" name="category" value="News"> News</label>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "Add Post",
            preConfirm: () => {
                const title = document.getElementById("swal-title").value;
                const description = document.getElementById("swal-description").value;
                const category = document.querySelector('input[name="category"]:checked')?.value;
                if (!title || !description || !category) {
                    Swal.showValidationMessage("All fields are required!");
                    return false;
                }
                return { title, description, category };
            },
        });

        if (formValues) {
            try {
                const user = auth.currentUser;
                if (user) {
                    const postsRef = collection(db, "posts");
                    await addDoc(postsRef, {
                        userId: user.uid,
                        username: user.displayName || "Anonymous", // Get username from user
                        title: formValues.title,
                        description: formValues.description,
                        category: formValues.category, // Save category
                        timestamp: serverTimestamp(),
                    });
                    Swal.fire("Post Added!", "Your post has been successfully added.", "success");
                    displayPosts(); // Refresh posts
                }
            } catch (error) {
                Swal.fire("Error", "Could not save the post. Please try again.", "error");
                console.error("Error saving post:", error);
            }
        }
    });
}

// const createPostBtn = document.querySelector(".create-post-btn");
// if (createPostBtn) {
//     createPostBtn.addEventListener("click", async () => {
//         const { value: formValues } = await Swal.fire({
//             title: "Create Post",
//             html: `
//                 <input id="swal-title" class="swal2-input" placeholder="Post Title">
//                 <textarea id="swal-description" class="swal2-textarea" placeholder="Post Description"></textarea>
//             `,
//             focusConfirm: false,
//             showCancelButton: true,
//             confirmButtonText: "Add Post",
//             preConfirm: () => {
//                 const title = document.getElementById("swal-title").value;
//                 const description = document.getElementById("swal-description").value;
//                 if (!title || !description) {
//                     Swal.showValidationMessage("Both fields are required!");
//                     return false;
//                 }
//                 return { title, description };
//             },
//         });

//         if (formValues) {
//             try {
//                 const user = auth.currentUser;
//                 if (user) {
//                     const postsRef = collection(db, "posts");
//                     await addDoc(postsRef, {
//                         userId: user.uid,
//                         username: user.displayName || "Anonymous", // Get username from user
//                         title: formValues.title,
//                         description: formValues.description,
//                         timestamp: serverTimestamp(),
//                     });
//                     Swal.fire("Post Added!", "Your post has been successfully added.", "success");
//                     displayPosts(); // Refresh posts beneath trending topics
//                 }
//             } catch (error) {
//                 Swal.fire("Error", "Could not save the post. Please try again.", "error");
//                 console.error("Error saving post:", error);
//             }
//         }
//     });
// }

// Display Posts on Dashboard
// async function displayPosts() {
//     const postsContainer = document.getElementById("postContent");

//     if (!postsContainer) {
//         console.error("The posts container was not found in the DOM.");
//         return;
//     }

//     postsContainer.innerHTML = ""; // Clear existing posts

//     try {
//         const postsRef = collection(db, "posts");
//         const q = query(postsRef, orderBy("timestamp", "desc"));
//         const querySnapshot = await getDocs(q);

//         querySnapshot.forEach((doc) => {
//             const post = doc.data();
//             const postId = doc.id;

//             const postCard = `
//                 <div class="card mb-3" data-id="${postId}">
//                     <div class="card-body">
//                         <h5 class="card-title">${post.title}</h5>
//                         <p class="card-text">${post.description}</p>
//                         <p class="text-muted small">${post.timestamp ? new Date(post.timestamp.toMillis()).toLocaleString() : "No timestamp"}</p>
//                         <p class="font-weight-bold">${post.username}</p> <!-- Display username -->
//                         <button class="btn btn-warning edit-post-btn" data-id="${postId}">Edit</button>
//                         <button class="btn btn-danger delete-post-btn" data-id="${postId}">Delete</button>
//                     </div>
//                 </div>
//             `;
//             postsContainer.innerHTML += postCard;
//         });

//     } catch (error) {
//         console.error("Error fetching posts:", error);
//     }
// }


const searchButton = document.querySelector("button[type='button']");
if (searchButton) {
    searchButton.addEventListener("click", async () => {
        const searchTerm = document.getElementById("search-bar").value.toLowerCase();
        if (!searchTerm) {
            Swal.fire("Error", "Please enter a search term", "error");
            return;
        }

        try {
            const postsRef = collection(db, "posts");
            const q = query(postsRef, orderBy("timestamp", "desc"));
            const querySnapshot = await getDocs(q);

            const filteredPosts = [];
            querySnapshot.forEach((doc) => {
                const post = doc.data();
                const postTitle = post.title.toLowerCase();
                const postDescription = post.description.toLowerCase();
                const postCategory = post.category.toLowerCase();

                // Filter posts by search term
                if (postTitle.includes(searchTerm) || postDescription.includes(searchTerm) || postCategory.includes(searchTerm)) {
                    filteredPosts.push(post);
                }
            });

            // Display filtered posts
            displayFilteredPosts(filteredPosts);
        } catch (error) {
            console.error("Error searching posts:", error);
        }
    });
}

// Function to display filtered posts
function displayFilteredPosts(filteredPosts) {
    const postsContainer = document.getElementById("postContent");
    postsContainer.innerHTML = ""; // Clear current posts

    filteredPosts.forEach(post => {
        const postCard = `
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-text">${post.description}</p>
                    <p class="text-muted small">${post.timestamp ? new Date(post.timestamp.toMillis()).toLocaleString() : "No timestamp"}</p>
                    <p class="font-weight-bold">${post.username}</p> <!-- Display username -->
                    <p class="font-weight-bold text-primary">${post.category}</p> <!-- Display category -->
                </div>
            </div>
        `;
        postsContainer.innerHTML += postCard;
    });
}

// async function displayPosts() {
//     const postsContainer = document.getElementById("postContent");

//     if (!postsContainer) {
//         console.error("The posts container was not found in the DOM.");
//         return;
//     }

//     postsContainer.innerHTML = ""; // Clear existing posts

//     try {
//         const postsRef = collection(db, "posts");
//         const q = query(postsRef, orderBy("timestamp", "desc"));
//         const querySnapshot = await getDocs(q);

//         querySnapshot.forEach((doc) => {
//             const post = doc.data();
//             const postId = doc.id;

//             const postCard = `
//                 <div class="card mb-3" data-id="${postId}">
//                     <div class="card-body">
//                         <h5 class="card-title">${post.title}</h5>
//                         <p class="card-text">${post.description}</p>
//                         <p class="text-muted small">${new Date(post.timestamp.toMillis()).toLocaleString()}</p>
//                         <p class="font-weight-bold">${post.username}</p> <!-- Display username -->
//                         <button class="btn btn-warning edit-post-btn" data-id="${postId}">Edit</button>
//                         <button class="btn btn-danger delete-post-btn" data-id="${postId}">Delete</button>
//                     </div>
//                 </div>
//             `;
//             postsContainer.innerHTML += postCard;
//         });

//     } catch (error) {
//         console.error("Error fetching posts:", error);
//     }
// }
async function displayPosts() {
    const postsContainer = document.getElementById("postContent");

    if (!postsContainer) {
        console.error("The posts container was not found in the DOM.");
        return;
    }

    postsContainer.innerHTML = ""; // Clear existing posts

    try {
        const postsRef = collection(db, "posts");
        const q = query(postsRef, orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            const post = doc.data();
            const postId = doc.id;

            const postCard = `
                <div class="card mb-3" data-id="${postId}">
                    <div class="card-body">
                        <h5 class="card-title">${post.title}</h5>
                        <p class="card-text">${post.description}</p>
                        <p class="text-muted small">${post.timestamp ? new Date(post.timestamp.toMillis()).toLocaleString() : "No timestamp"}</p>
                        <p class="font-weight-bold">${post.username}</p> <!-- Display username -->
                        <p class="font-weight-bold text-primary">${post.category}</p> <!-- Display category -->
                        <button class="btn btn-warning edit-post-btn" data-id="${postId}">Edit</button>
                        <button class="btn btn-danger delete-post-btn" data-id="${postId}">Delete</button>
                    </div>
                </div>
            `;
            postsContainer.innerHTML += postCard;
        });

    } catch (error) {
        console.error("Error fetching posts:", error);
    }
}

// Initially load posts
displayPosts();


// Search Function
const searchBtn = document.getElementById("search-btn");
const searchBar = document.getElementById("search-bar");

if (searchBtn) {
    searchBtn.addEventListener("click", async () => {
        const queryTerm = searchBar.value.trim();

        if (queryTerm) {
            searchPosts(queryTerm); // Perform search
        } else {
            Swal.fire("Error", "Please enter a search term.", "error");
        }
    });
}

// Function to search posts
async function searchPosts(queryTerm) {
    const postsContainer = document.getElementById("postContent");
    postsContainer.innerHTML = ""; // Clear existing posts

    try {
        const postsRef = collection(db, "posts");
        const q = query(postsRef, orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);

        let foundPosts = [];
        
        // Filter posts that match the search query
        querySnapshot.forEach((doc) => {
            const post = doc.data();
            if (post.title.includes(queryTerm) || post.description.includes(queryTerm)) {
                foundPosts.push({ ...post, postId: doc.id });
            }
        });

        if (foundPosts.length === 0) {
            postsContainer.innerHTML = "<p>No posts found matching your search.</p>";
        } else {
            // Display matching posts
            foundPosts.forEach((post) => {
                const postCard = `
                    <div class="card mb-3" data-id="${post.postId}">
                        <div class="card-body">
                            <h5 class="card-title">${post.title}</h5>
                            <p class="card-text">${post.description}</p>
                            <p class="text-muted small">${new Date(post.timestamp.toMillis()).toLocaleString()}</p>
                            <p class="font-weight-bold">${post.username}</p> <!-- Display username -->
                            <button class="btn btn-warning edit-post-btn" data-id="${post.postId}">Edit</button>
                            <button class="btn btn-danger delete-post-btn" data-id="${post.postId}">Delete</button>
                        </div>
                    </div>
                `;
                postsContainer.innerHTML += postCard;
            });
        }
    } catch (error) {
        console.error("Error searching posts:", error);
    }
}
