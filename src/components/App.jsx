import React, { useState, useEffect } from 'react';

import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';
import Button from './Button/Button';

import { fetchImages } from 'services/api';
import css from './App.module.css';

export const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [totalHits, setTotalHits] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalVisibleData, setModalVisibleData] = useState(null);

  const onSubmitForm = e => {
    e.preventDefault();

    setPage(1);
    const inputValue = e.target.elements[1].value;

    if (inputValue === '') {
      setImages([]);
      setSearchQuery('');
      return alert('Please enter what images do you want to find?');
    }

    setSearchQuery(inputValue);
    e.target.elements[1].value = '';
  };

  const onLoadMoreBtnClick = () => {
    setPage(prevValue => prevValue + 1);
  };

  const onSelectImage = imageId => {
    setSelectedImage(imageId);
  };

  const onOpenModal = data => {
    setModalIsOpen(true);
    setModalVisibleData(data);
  };

  const onCloseModal = () => {
    setModalIsOpen(false);
    setModalVisibleData(null);
    setSelectedImage(null);
  };

  const fetchData = async (searchQuery, page) => {
    try {
      setIsLoading(true);

      const { hits, totalHits } = await fetchImages(searchQuery, page);

      if (page === 1) {
        setImages([...hits]);
        setTotalHits(totalHits);
      } else {
        setImages(prevImages => [...prevImages, ...hits]);
        setTotalHits(totalHits);
      }

      if (hits.length === 0) {
        alert(
          "Oops! We didn't find any image on this query. Please try another one..."
        );
        setSearchQuery('');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery === '') {
      return;
    }

    setError(null);

    fetchData(searchQuery, page);
  }, [searchQuery, page]);

  useEffect(() => {
    if (selectedImage === null) {
      return;
    }

    const largeImage = images.find(el => el.id === selectedImage);

    onOpenModal(largeImage);
  }, [images, selectedImage]);

  return (
    <div className={css.App}>
      <Searchbar onSubmitForm={onSubmitForm} />
      {isLoading && images.length <= 0 && <Loader />}
      {error !== null && (
        <p>Something wrong. The error is: {error}. Please try again later.</p>
      )}
      {images.length > 0 && (
        <ImageGallery images={images} selectImg={onSelectImage} />
      )}
      {isLoading && images.length > 0 && <Loader />}
      {images.length > 0 && page < Math.ceil(totalHits / 12) && (
        <Button onBtnClick={onLoadMoreBtnClick} />
      )}
      {modalIsOpen && (
        <Modal modalData={modalVisibleData} onCloseModal={onCloseModal} />
      )}
    </div>
  );
};
