var path = require('path');

class HomeController {
    home(request, response) {
        return response.sendFile(path.resolve(__dirname + "/../../views/index.html"));
    }
}

module.exports = HomeController;