var GIPHY_API_URL = 'http://api.giphy.com';
var GIPHY_PUB_KEY = 'Vcsr4uN2rldkfG0EGIbkLPEJmKzc31gc';

App = React.createClass({
    getInitialState() {
        return {
            loading: false,
            searchingText: '',
            gif: {}
        };
    },

    handleSearch: function(searchingText) {
        this.setState({
            loading: true
        }); 
        this.getGif(searchingText)
            .then(gif => {
                this.setState({
                    loading: false,
                    gif: gif,
                    searchingText: searchingText          
                });
            })
            .catch(error => console.log('Search Error', error));
    },

    getGif: function(searchingText) {
        var url = GIPHY_API_URL + '/v1/gifs/random?api_key=' + GIPHY_PUB_KEY + '&tag=' + searchingText;
        return new Promise(
            function(resolve, reject) {
                var request = new XMLHttpRequest();
                request.onload = function() {
                    if (this.status === 200) {
                        var data = JSON.parse(request.responseText).data;
                        var gif = { 
                            url: data.fixed_width_downsampled_url,
                            sourceUrl: data.url
                        }
                        resolve(gif);
                    } else {
                        reject(new Error(this.statusText));
                    }
                };
                request.onerror = function() {
                    reject(new Error(
                        `Request Error: ${this.statusText}`));
                };
                request.open('GET', url);
                request.send();
            });
    },

    render: function() {
        var styles = {
            margin: '0 auto',
            textAlign: 'center',
            width: '90%'
        };

        return (
          <div style={styles}>
                <h1>GIFs Finder!</h1>
                <p>Find your GIF on <a href='http://giphy.com'>giphy</a>.<br/><br/>Press enter to get another GIF.</p>
            <Search 
                onSearch={this.handleSearch}
            />
            <Gif 
                loading={this.state.loading}
                url={this.state.gif.url}
                sourceUrl={this.state.gif.sourceUrl}
            />
          </div>
        );
    }
});