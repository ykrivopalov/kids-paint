import React from 'react';

const EMOJI_LIST = [
    '😀', '😂', '🥰', '😎', '🤩', '😜', '🥳', '😺',
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '💖',
    '⭐', '🌟', '✨', '💫', '🔥', '💥', '❄️', '🌈',
    '🌸', '🌺', '🌻', '🌹', '🍀', '🌴', '🌵', '🍄',
    '🦋', '🐝', '🐞', '🐸', '🐱', '🐶', '🐰', '🐼',
    '🦄', '🐉', '🦖', '🐙', '🐬', '🦀', '🐠', '🐢',
    '🍎', '🍓', '🍉', '🍕', '🍩', '🧁', '🍦', '🍭',
    '⚽', '🏀', '🎾', '🎯', '🎮', '🎸', '🎨', '🎭',
    '🚀', '✈️', '🚗', '🚂', '⛵', '🎠', '🏰', '🎪',
    '👑', '💎', '🎀', '🎈', '🎉', '🎊', '🪅', '🧸',
    '👽', '🤖', '👻', '💩', '🎃', '☠️', '👾', '🧲',
];

const EmojiPicker = ({ activeEmoji, onSelect }) => {
    return (
        <div className="emoji-picker">
            <div className="emoji-list">
                {EMOJI_LIST.map((emoji) => (
                    <button
                        key={emoji}
                        className={`emoji-btn ${activeEmoji === emoji ? 'selected' : ''}`}
                        onClick={() => onSelect(emoji)}
                        title={emoji}
                    >
                        {emoji}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default EmojiPicker;
