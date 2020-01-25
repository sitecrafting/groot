module.exports = () => {
    const path = require('path');
    const isGrootDev = 'LANDO_APP_NAME' in process.env
        && process.env.LANDO_APP_NAME === 'groot';

    // Assume we're developing Groot itself, and not a project based on it
    let themeDirectory = 'groot';

    // If we're working on a client project, grab the normalized cwd basename
    // instead (i.e. the theme's root directory)
    if (!isGrootDev) {
        themeDirectory = path.basename(path.resolve());
    }

    return `/wp-content/themes/${themeDirectory}/`;
}