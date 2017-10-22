import React, { Component } from 'react';
import Modal from 'react-modal';
import MdClose from 'react-icons/lib/md/close';

Modal.setAppElement('#app');

class AboutModal extends Component {
  constructor() {
    super();
    this.state = {
      showModal: false
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  render() {
    return (
      <div style={{ display: 'inline-block' }}>
        <button className="about-btn" onClick={this.handleOpenModal}>
          About
        </button>
        <Modal
          style={{
            content: {
              backgroundColor: '#222',
              color: '#eee',
              left: 350,
              right: 80,
              border: '1px solid #444',
              paddingTop: 0
            },
            overlay: { zIndex: 99, backgroundColor: 'rgba(0, 0, 0, 0.75)' }
          }}
          isOpen={this.state.showModal}
          contentLabel="onRequestClose Example"
          onRequestClose={this.handleCloseModal}
        >
          <h2>About</h2>
          <button
            onClick={this.handleCloseModal}
            style={{ marginTop: 0, top: 0 }}
            className="delete-button"
          >
            <MdClose />
          </button>
        </Modal>
      </div>
    );
  }
}

export default AboutModal;
