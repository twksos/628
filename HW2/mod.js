function mod(a, b) {
    if (a >= 0) return a % b;
    return a % b + b;
};

module.exports = {mod};