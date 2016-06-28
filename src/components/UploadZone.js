import React, {Component, PropTypes} from 'react';

let isFunction = function(func) {
	return Object.prototype.toString.call(func) === '[object Function]';
}

class UploadZone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDragActive: false
    };
  }
  onDragLeave(e) {
    this.setState({
      isDragActive: false
    });
  }
  onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    this.setState({
      isDragActive: true
    });
  }
  onDrop(e) {
    e.preventDefault();
    this.setState({
      isDragActive: false
    });
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    let maxFiles = (this.props.multiple) ? files.length : 1;
    if (this.props.onUpload) {
      files = Array.prototype.slice.call(files, 0, maxFiles);
      this.props.onUpload(files, e);
    }
    files.map((value, index) => {
      files[index].preview = URL.createObjectURL(files[index]);
      files[index].request = this.upload(files[index]);
      files[index].uploadPromise = files[index].request.promise();
    })
    if (this.props.onDrop) {
      files = Array.prototype.slice.call(files, 0, maxFiles);
      this.props.onDrop(files, e);
    }
  }
  onClick() {
    if (this.props.supportClick) {
      this.open();
    }
  }
  open() {
    let fileInput = React.findDOMNode(this.refs.fileInput);
    fileInput.value = null;
    fileInput.click();
  }
  upload(file) {
    if (!file || filesize === 0) {
      return null;
    }
    let key = file.preview.split('/').pop() + '.' + file.name.split('.').pop();
    if (this.props.prefix) {
      key = this.props.prefix + key;
    }
    let req = request
      .post(this.props.uploadUrl)
      .field('key', key)
      .field('token', this.props.token)
      .field('x:filename', file.name)
      .field('x:size', file.size)
      .attach('file', file, file.name)
      .set('Accept', 'application/json');
    if (isFunction(file.onprogress)) {
      req.on('progress', file.onprogress);
    }
    return req;
  }
  render() {
    let className = this.props.className || 'upload-zone';
    if (this.state.isDragActive) {
      className += 'active';
    }
    var style = this.props.style || {
      width: this.props.size || 400,
      height: this.props.size || 300,
      borderStyle: this.state.isDragActive ? 'solid' : 'dashed'
    };
    return (
      <div className={className} style={style} onClick={this.onClick.bind(this)}
        onDragOver={this.onDragOver.bind(this)} onDragLeave={this.onDragLeave.bind(this)}
        onDrop={this.onDrop.bind(this)}>
        <input type='file' multiple={this.props.multiple} ref='fileInput' 
        onChange={this.onDrop.bind(this)} accept={this.props.accept} />
      </div>
    )
  }
}

UploadZone.defaultProps = {
  supportClick: true,
  multiple: true,
  uploadUrl: 'http://upload.qiniu.com'
};
UploadZone.propTypes = {
  onDrop: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  onUpload: PropTypes.func,
  size: PropTypes.number,
  style: PropTypes.object,
  supportClick: PropTypes.bool,
  accept: PropTypes.string,
  uploadUrl: PropTypes.string,
  prefix: PropTypes.string
};

module.exports = UploadZone;
