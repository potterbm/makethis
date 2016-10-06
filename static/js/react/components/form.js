MakeThis.react.components.TextField = React.createClass({
  displayName: 'TextField',
  
  getDefaultProps: function() {
    return {};
  },
  
  render: function() {
    return (
      React.DOM.div({},
        React.DOM.label({}, this.props.label || this.props.name),
        React.DOM.input({type: this.props.type, name: this.props.name, noValidate: this.props.noValidate, placeholder: this.props.placeholder, autoCapitalize: this.props.autoCapitalize, onChange: this.props.onChange})
      )
    );
  }
});

MakeThis.react.components.TextBlob = React.createClass({
  displayName: 'TextBlob',
  
  getDefaultProps: function() {
    return {};
  },
  
  render: function() {
    return (
      React.DOM.div({},
        React.DOM.label({}, this.props.label || this.props.name),
        React.DOM.textarea({type: this.props.type, name: this.props.name, noValidate: this.props.noValidate, placeholder: this.props.placeholder, autoCapitalize: this.props.autoCapitalize, onBlur: this.props.onChange})
      )
    );
  }
});

MakeThis.react.components.ImageField = React.createClass({
  displayName: 'ImageField',
  
  getDefaultProps: function() {
    return {
      "preview_supported" : window.File && window.FileList && window.FileReader
    };
  },
  
  getInitialState: function() {
    return {
      "show_progress" : false,
      "upload_progress" : 0
    };
  },
  
  handleImageSelect: function(event) {
    console.log(event);
    this.props.handleImageChange(event);
    
    var fileList = event.target.files || event.dataTransfer.files;
    
    var file = fileList.item(0); // This could be null
    if(!file) { return; }
    
    var fileReader = new FileReader();
    fileReader.onloadstart = this.handleFileReadStart;
    fileReader.onprogress = this.handleFileProgress;
    fileReader.onload = this.handleFileLoad;
    fileReader.onloadend = this.handleFileLoadEnd;
    
    fileReader.readAsDataURL(file);
  },
  
  handleFileReadStart: function(event) {
    console.log('handleFileReadStart');
    this.setState({ "show_progress" : true });
  },
  
  handleFileProgress: function(event) {
    console.log('handleFileProgress');
    this.setState({ "progress" : (Math.round((event.loaded / event.total)) * 100) });
  },
  
  handleFileLoadEnd: function(event) {
    console.log('handleFileLoadEnd', event);
    this.setState({ "progress" : 100 });
    
    window.setTimeout(function() {
      this.setState({ "progress" : 0, "show_progress" : false });
    }.bind(this), 500);
  },
  
  handleFileLoad: function(event) {
    console.log('handleFileLoad', event);
    this.setState({ "image_url" : event.target.result });
  },
  
  renderFilePreview: function() {
    return (
      React.DOM.div({className: "file-preview", style: {backgroundImage: "url(" + this.state.image_url + ")"}},
        React.DOM.label({}, this.props.label || this.props.name),
        React.DOM.input({type: "file", name: this.props.name, accept: 'image/*', formEncType: 'multipart/form-data', placeholder: this.props.placeholder, onChange: this.handleImageSelect}),
        React.createElement(MakeThis.react.components.ImagePreviewProgress, { show_progress: this.state.show_progress, progress: this.state.upload_progress })
      )
    );
  },
  
  renderFileInput: function() {
    return (
      React.DOM.div({},
        React.DOM.label({}, this.props.label || this.props.name),
        React.DOM.input({type: "file", name: this.props.name, accept: 'image/*', formEncType: 'multipart/form-data', placeholder: this.props.placeholder, onChange: this.props.onChange})
      )
    );
  },
  
  render: function() {
    if(this.props.preview_supported) {
      return this.renderFilePreview();
    }
    else {
      return this.renderFileInput();
    }
  }
});

MakeThis.react.components.ImagePreviewProgress = React.createClass({
  displayName: 'ImagePreviewProgress',
  
  propTypes: {
    progress: React.PropTypes.number,
    show_progress: React.PropTypes.bool
  },
  
  getDefaultProps: function() {
    return {};
  },
  
  getInitialState: function() {
    return {};
  },
  
  render: function() {
    var classes = ["file-preview-progress"];
    
    if(this.props.show_progress) {
      classes.push("file-progress-shown");
    }
    
    if(this.props.progress >= 100) {
      classes.push("file-progress-finished");
    }
    
    return (
      React.DOM.div({className: classes.join(' ')},
        React.DOM.span({className: "file-preview-progress-bar", style: { "width" : this.props.progress }})
      )
    );
  }
});