export function isImage4Kabove(width: number, height: number): boolean {
    const resolutions4K = [
        { width: 3840, height: 2160 },
        { width: 4096, height: 2160 }
    ];

    for (const res of resolutions4K) {
        if (width >= res.width && height >= res.height) {
            return true;
        }
    }
    return false;
}

export function checkImageDimensions(file: File, maxWidth: number, maxHeight: number): Promise<{ 
    valid: boolean,
    width?: number,
    height?: number, 
    errorMessage?: string 
}> {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const width = img.width;
            const height = img.height;

            if (width <= maxWidth && height <= maxHeight) {
                resolve({ valid: true, width, height });
            } else {
                resolve({
                    valid: false,
                    errorMessage: `Image dimensions must not exceed ${maxWidth}x${maxHeight} pixels. Current dimensions are ${width}x${height} pixels.`
                });
            }
        };

        img.onerror = () => {
            resolve({
                valid: false,
                errorMessage: "Failed to load the image. Please check if the file is a valid image."
            });
        };

        img.src = URL.createObjectURL(file);
    });
}
