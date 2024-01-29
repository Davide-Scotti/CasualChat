function redirectToSingleChat() {
    window.location.href = "single.html";
}

function showGroupChatConfirmation() {
    if (confirm("Do you want to open a new group chat?")) {
        window.location.href = "group.html";
    }
}