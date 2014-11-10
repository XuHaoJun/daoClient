/** @jsx React.DOM */

var React = require('react');

var DaoDocument = module.exports = React.createClass({
  render: function() {
    return (
      <object data="assets/doc/dao-design-document.pdf" type="application/pdf" width="100%" height="600px">
        <p>It appears you don't have a PDF plugin for this browser.
          No biggie... you can <a href="assets/doc/dao-design-document.pdf"> click here to
          download the PDF file.</a></p>
      </object>
    );
  }
});
