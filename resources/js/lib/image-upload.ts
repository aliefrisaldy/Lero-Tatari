/** Batas maksimal ukuran gambar yang diunggah dari panel admin: 1 MB. */
export const MAX_IMAGE_SIZE_BYTES = 1024 * 1024;

/** Pesan peringatan bila gambar yang dipilih melebihi batas ukuran. */
export const IMAGE_TOO_LARGE_MESSAGE =
    'Ukuran gambar terlalu besar. Maksimal 1 MB.';

/** Tentukan apakah berkas gambar melebihi batas 1 MB. */
export function isImageTooLarge(file: File): boolean {
    return file.size > MAX_IMAGE_SIZE_BYTES;
}
