const { nanoid } = require('nanoid');
const books = require('./books');

// Handler untuk Menambahkan Buku
const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        }).code(400);
    }

    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
    }

    const id = nanoid(16);
    const finished = readPage === pageCount;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
    };

    books.push(newBook);

    return h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
            bookId: id,
        },
    }).code(201);
};

// Handler untuk Menampilkan Seluruh Buku
const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;
    let filteredBooks = books;

    // Filter berdasarkan query parameter 'name'
    if (name) {
        const lowerCasedName = name.toLowerCase();
        filteredBooks = filteredBooks.filter((book) =>
            book.name.toLowerCase().includes(lowerCasedName)
        );
    }

    // Filter berdasarkan query parameter 'reading'
    if (reading === '0') {
        filteredBooks = filteredBooks.filter((book) => book.reading === false);
    } else if (reading === '1') {
        filteredBooks = filteredBooks.filter((book) => book.reading === true);
    }

    // Filter berdasarkan query parameter 'finished'
    if (finished === '0') {
        filteredBooks = filteredBooks.filter((book) => book.finished === false);
    } else if (finished === '1') {
        filteredBooks = filteredBooks.filter((book) => book.finished === true);
    }

    // Menampilkan hanya properti yang diinginkan
    const responseBooks = filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
    }));

    return h.response({
        status: 'success',
        data: {
            books: responseBooks,
        },
    }).code(200);
};

// Handler untuk Menampilkan Detail Buku Berdasarkan ID
const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.find((buku) => buku.id === bookId);

    if (!book) {
        return h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        }).code(404);
    }

    return {
        status: 'success',
        data: {
            book,
        },
    };
};

// Handler untuk Mengubah Data Buku Berdasarkan ID
const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const index = books.findIndex((book) => book.id === bookId);

    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        }).code(400);
    }

    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
    }

    if (index === -1) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        }).code(404);
    }

    const updatedAt = new Date().toISOString();

    books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt,
    };

    return h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
    }).code(200);
};

// Handler untuk Menghapus Buku Berdasarkan ID
const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const index = books.findIndex((book) => book.id === bookId);

    if (index === -1) {
        return h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        }).code(404);
    }

    books.splice(index, 1);

    return h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
    }).code(200);
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};
