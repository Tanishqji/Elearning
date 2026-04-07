# 📚 Apni E-Kitabein - Full Stack MERN Platform

A premium E-Learning web application built entirely on the modern **MERN Stack** (MongoDB, Express, React, Node.js). It features a beautiful, dynamic user interface, a secure authentication system, a built-in free-trial mechanism, and a seamless Razorpay subscription payment gateway.

---

## 🏗️ Project Structure

The codebase is cleanly separated into two main directories to maintain standard professional architecture:

* **`/frontend`** (The User Interface)
  * Built using **React.js** and powered by **Vite** for blazing fast performance.
  * Contains the visual UI, Book Sliders, Login functionalities, and the Razorpay Checkout popup logic.
  * *To run:* `npm run dev`

* **`/backend`** (The Server & Database Logic)
  * Built using **Node.js** and **Express.js**.
  * securely connects to **MongoDB Atlas** to store all user data in the cloud.
  * Handles authentication, checks if trial periods are over, and cryptographically verifies Razorpay payments to prevent hacking.
  * *To run:* `node server.js`

---

## 🔄 How The Platform Works (The Workflow)

We designed a workflow that is incredibly smooth and easy for the user to navigate:

1. **Browsing Anonymously:** A user lands on the website and can view the beautifully designed homepage carousels (Swiper.js) featuring "Programming Books" and "Top Comics".
2. **Registration & Free Trial:** Before downloading any PDF, they must create an account. The exact second they register, the database logs the current date and grants them an automatic **3-Day Free Trial**.
3. **Reading Books:** For the next 72 hours, the user can click "Download" on any book and the PDF will instantly download to their machine.
4. **The Lockout:** If 3 days pass and the trial expires, the backend will block their download request. Instead of getting the PDF, an alert appears telling them their trial has ended and asking if they want to upgrade.

---

## 💳 How The Payment System Works (Razorpay)

When a user's trial is up, the process below guarantees that payments are safely handled and access is accurately granted:

1. **Starting the Order:** The user clicks *Buy Subscription*. The React Frontend tells the Node Backend "Hey, I want to buy a subscription!"
2. **Generating a Secure Ticket:** The backend secretly talks to Razorpay servers and generates a secure `Order_ID` for ₹299. It sends this Ticket back to the Frontend so nobody can manipulate the price.
3. **The Popup:** The Razorpay checkout UI dynamically pops out over the screen, allowing the user to select Cards, UPI, or Netbanking.
4. **Completing the Payment:** The user simulates a successful payment.
5. **The Cryptographic Verification:** Once successful, the frontend receives three encrypted receipt strings and hands them to the Backend. The Backend uses a heavily encrypted secret key (`RAZORPAY_KEY_SECRET`) to mathematically prove the payment is authentic.
6. **Unlocking Lifetime Access:** The MongoDB database flips the user's `isSubscribed` flag to `true`. The frontend automatically updates—creating a Premium Crown (👑) badge next to their username, wiping the "Buy Subscription" button permanently off the screen, and unlocking all PDFs forever!
