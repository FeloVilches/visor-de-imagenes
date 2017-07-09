import React from 'react';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import Path from 'path';
import Breadcrumb from './breadcrumb';
import Url from './url';


export default class Manga extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      mangaName: "",
      dirs: [],
      files: [],
      currentDir: "",
      currentPhoto: ""
    };
  }

  componentDidMount(){
    this.update();
  }

  componentWillReceiveProps(props){
    this.update(props);
  }


  update(props){

    // refactorizar este codigo,
    // hacer que solo haga el AJAX si cambia el directorio
    // pero las otras cosas las puede hacer (como marcar
    // el archivo actual, etc)

    if(!props)
      props = this.props;

    this.setState({
      currentPhoto: props.currentPhoto
    });

    var previousCurrentDir = this.state.currentDir;

    var currentDir = Url.mangaUrlClean(props.location.pathname);


    if(previousCurrentDir == currentDir){
      return;
    }

    $.ajax({
      url: window.location.protocol + "//" + Path.join(Url.host, Url.mangaServiceUrl, currentDir),
      data: {
        name: true,
        onlymetadata: true
      }
    }).done(function(data){

      var mangaName = data.manga.name;

      if(mangaName != this.state.mangaName){
        this.props.setImage(Path.join(mangaName, data.manga.lastPage));
      }

      this.setState({
        dirs: data.dirs,
        files: data.files,
        mangaName: mangaName,
        currentDir: currentDir
      });

    }.bind(this)).catch(function(err){
      console.log(err);
    });
  }

  

	render() {
		return(
      <div>

        <h1>{ this.state.mangaName }</h1>

          

        {/* Current directory breadcrumb */}
        <Breadcrumb url={ this.state.currentDir } currentDir={ this.state.currentDir } ></Breadcrumb>

        {/* Directories */}

          <div className="col-md-3">
          {this.state.dirs.map(function(m, i){
            return (
            <Link to={ Path.join(Url.mangaSpaUrl, this.state.currentDir, m) } key={ i }>
              <div className="dir-file"><i className="glyphicon glyphicon-folder-open"></i> <span className="folder-name">{ m }</span></div>
            </Link>
            )
          }.bind(this))}

        {/* Files */}
          {this.state.files.map(function(m, i){
            return (
            <a href="javascript:;" key={ i } onClick={ () => this.props.setImage(Path.join(this.state.currentDir, m)) }>
              <div className={ this.state.currentPhoto == Path.join(this.state.currentDir, m) ? 'dir-file current-file' : 'dir-file' }>
                <i className="glyphicon glyphicon-file"></i>
                <span className="folder-name">{ m }</span>
              </div>
            </a>
            )
          }.bind(this))}
          </div>


      </div>
		);
	}

}
