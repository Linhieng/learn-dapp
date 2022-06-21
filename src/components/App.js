import React, { Component } from 'react'
import './App.css'

class App extends Component {
  render() {
    return (
      <div>

        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <a href="localhost:3000" className="navbar-brand">Navbar</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" > {/* 这里少了点 prop */}
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
              <li className="nav-item"> <a href="localhost:3000" className="nav-link">Link 1</a> </li>
              <li className="nav-item"> <a href="localhost:3000" className="nav-link">Link 2</a> </li>
              <li className="nav-item"> <a href="localhost:3000" className="nav-link">Link 3</a> </li>
            </ul>
          </div>
        </nav>

        <div className="content">

          <div className="vertical-split">
            <div className="card bg-dark text-white">
              <div className="card-header">Card Title</div>
              <div className="card-body">
                <p className="card-text">Some quick example text</p>
                <a href="localhost:3000" className="card-link">Card link</a>
              </div>
            </div>
            <div className="card bg-dark text-white">
              <div className="card-header">Card Title</div>
              <div className="card-body">
                <p className="card-text">Some quick example text</p>
                <a href="localhost:3000" className="card-link">Card link</a>
              </div>
            </div>
          </div>

          <div className="vertical">
            <div className="card bg-dark text-white">
              <div className="card-header">Card Title</div>
              <div className="card-body">
                <p className="card-text">Some quick example text</p>
                <a href="localhost:3000" className="card-link">Card link</a>
              </div>
            </div>
          </div>

          <div className="vertical-split">
            <div className="card bg-dark text-white">
              <div className="card-header">Card Title</div>
              <div className="card-body">
                <p className="card-text">Some quick example text</p>
                <a href="localhost:3000" className="card-link">Card link</a>
              </div>
            </div>
            <div className="card bg-dark text-white">
              <div className="card-header">Card Title</div>
              <div className="card-body">
                <p className="card-text">Some quick example text</p>
                <a href="localhost:3000" className="card-link">Card link</a>
              </div>
            </div>
          </div>

          <div className="vertical">
            <div className="card bg-dark text-white">
              <div className="card-header">Card Title</div>
              <div className="card-body">
                <p className="card-text">Some quick example text</p>
                <a href="localhost:3000" className="card-link">Card link</a>
              </div>
            </div>
          </div>

        </div>

      </div>
    )
  }
}

export default App
