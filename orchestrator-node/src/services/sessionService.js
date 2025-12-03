const sessions = {};

exports.getSession = (sid) => sessions[sid] || null;

exports.createSession = () => {
    const id = Math.random().toString(36).substring(2, 10);
    sessions[id] = {
        history: [],
        cart: []
    };
    return id;
};

exports.addToHistory = (sid, role, text) => {
    sessions[sid].history.push({ role, text, at: new Date() });
};
