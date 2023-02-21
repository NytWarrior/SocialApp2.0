class ChatEngine {
    constructor(chatBoxId, userName) {
        this.chatBox = $(`#${chatBoxId}`);
        this.userName = userName;

        this.socket = io.connect('http://localhost:5000');

        if (this.userName) {
            this.connectionHandler();
        }

    }


    connectionHandler() {
        let self = this;

        this.socket.on('connect', function () {
            console.log('connection established using sockets...!');


            self.socket.emit('join_room', {
                user_name: self.userName,
                chatroom: 'socialApp'
            });

            self.socket.on('user_joined', function (data) {
                console.log('a user joined!', data);
            })


        });

        //send a message on clicking the send message button
        $('#send-message').click(function () {
            let msg = $('#chat-message-input').val();

            // var userInput = $('.text-box');
            // // clean out old message
            // userInput.html('');
            // // focus on input
            // userInput.focus();

            var messagesContainer = $('.messages');

            messagesContainer.finish().animate({
                scrollTop: messagesContainer.prop("scrollHeight")
            }, 250);

            if (msg != '') {
                self.socket.emit('send_message', {
                    message: msg,
                    user_name: self.userName,
                    chatroom: 'socialApp'
                });
            }
        });

        self.socket.on('receive_message', function (data) {
            console.log('message received', data.message);

            var messagesContainer = $('.messages');

            messagesContainer.finish().animate({
                scrollTop: messagesContainer.prop("scrollHeight")
            }, 250);


            let newMessage = $('<li>');

            let messageType = 'other-message';

            if (data.user_name == self.userName) {
                messageType = 'self-message';
            }
            newMessage.append($('<p>', {
                'html': data.user_name
            }));

            newMessage.append($('<span>', {
                'html': data.message
            }));

            newMessage.append($('<sub>', {
                'html': new Date().toLocaleString("default", {
                    hour: "2-digit",
                    minute: "2-digit"
                }),
            }));

            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);
        })
    }
}

var element = $('.floating-chat');

setTimeout(function () {
    element.addClass('enter');
}, 1000);

element.click(openElement);

function openElement() {
    var messages = element.find('.messages');
    var textInput = element.find('.text-box');
    element.find('>i').hide();
    element.addClass('expand');
    element.find('.chat').addClass('enter');
    // textInput.keydown(onMetaAndEnter).prop("disabled", false).focus();
    element.off('click', openElement);
    element.find('.header button').click(closeElement);
    messages.scrollTop(messages.prop("scrollHeight"));
}

function closeElement() {
    element.find('.chat').removeClass('enter').hide();
    element.find('>i').show();
    element.removeClass('expand');
    element.find('.header button').off('click', closeElement);
    // element.find('.text-box').off('keydown', onMetaAndEnter).prop("disabled", true).blur();
    setTimeout(function () {
        element.find('.chat').removeClass('enter').show()
        element.click(openElement);
    }, 500);
}

// function onMetaAndEnter(event) {
//     if ((event.metaKey || event.ctrlKey) && event.keyCode == 13) {
//         sendNewMessage();
//     }
// }