
import { auth } from "./firebase-config.js";

import {
    sendSignInLinkToEmail,
    isSignInWithEmailLink,
    signInWithEmailLink,
    getIdTokenResult,
    signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const message = document.getElementById("message");
const loginBtn = document.getElementById("loginBtn");

const actionCodeSettings = {
    url: window.location.origin + window.location.pathname,
    handleCodeInApp: true
};

function showMessage(text, color = "#a78bfa") {
    message.textContent = text;
    message.style.color = color;
}

// Send passwordless login email
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim().toLowerCase();

    try {
        loginBtn.disabled = true;
        loginBtn.textContent = "Sending login link...";

        await sendSignInLinkToEmail(
            auth,
            email,
            actionCodeSettings
        );

        sessionStorage.setItem("emailForSignIn", email);

        showMessage(
            "Login link sent! Please check your email.",
            "#4ade80"
        );

        loginBtn.textContent = "Link Sent";

    } catch (error) {
        console.error("Email link error:", error);

        showMessage(
            error.message || "Unable to send login link.",
            "#ef7777"
        );

        loginBtn.disabled = false;
        loginBtn.textContent = "Send Login Link";
    }
});

// Complete passwordless login
async function completeLogin() {

    if (!isSignInWithEmailLink(auth, window.location.href)) {
        return;
    }

    let email = sessionStorage.getItem("emailForSignIn");

    if (!email) {
        email = window.prompt(
            "Enter the email address where you received the login link:"
        );
    }

    if (!email) {
        showMessage("Email is required to complete login.", "#ef7777");
        return;
    }

    try {
        showMessage("Verifying your login link...");

        const result = await signInWithEmailLink(
            auth,
            email.trim().toLowerCase(),
            window.location.href
        );

        sessionStorage.removeItem("emailForSignIn");

        // Check trusted administrator permission
        const tokenResult = await getIdTokenResult(result.user);

        if (tokenResult.claims.admin !== true) {
            await signOut(auth);

            showMessage(
                "Your account is not authorized for admin access.",
                "#ef7777"
            );

            return;
        }

        showMessage("Admin verified! Opening dashboard...", "#4ade80");

        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        );

        window.location.href = "dashboard.html";

    } catch (error) {
        console.error("Login verification error:", error);

        showMessage(
            "Invalid or expired login link. Please request a new one.",
            "#ef7777"
        );

        await signOut(auth);
    }
}

completeLogin();
