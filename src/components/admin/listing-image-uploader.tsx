import { useRef, useState, type ChangeEvent, type DragEvent } from "react";

import { PlusIcon, TrashIcon, UploadIcon } from "../ui/site-icon";

interface ListingImageUploaderProps {
    mainImage: string;
    galleryImages: string[];
    assetImages: string[];
    mainImageError?: string;
    onMainImageChange: (image: string) => void;
    onGalleryImagesChange: (images: string[]) => void;
}

async function readFilesAsDataUrls(files: File[]) {
    return Promise.all(files.map((file) => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
        reader.onerror = () => reject(new Error(`Unable to read ${file.name}.`));
        reader.readAsDataURL(file);
    })));
}

export function ListingImageUploader({
    mainImage,
    galleryImages,
    assetImages,
    mainImageError,
    onMainImageChange,
    onGalleryImagesChange
}: ListingImageUploaderProps) {
    const mainInputRef = useRef<HTMLInputElement | null>(null);
    const galleryInputRef = useRef<HTMLInputElement | null>(null);
    const [isMainDragActive, setIsMainDragActive] = useState(false);
    const [isGalleryDragActive, setIsGalleryDragActive] = useState(false);

    const previewGallery = [mainImage, ...galleryImages].filter((image, index, items) => image && items.indexOf(image) === index);

    const handleMainImageFiles = async (files: File[]) => {
        const [image] = await readFilesAsDataUrls(files.slice(0, 1));

        if (!image) {
            return;
        }

        onMainImageChange(image);
    };

    const handleGalleryFiles = async (files: File[]) => {
        const images = await readFilesAsDataUrls(files);

        onGalleryImagesChange([...galleryImages, ...images.filter(Boolean)]);
    };

    const handleMainImageInput = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);

        if (files.length > 0) {
            await handleMainImageFiles(files);
        }

        event.target.value = "";
    };

    const handleGalleryInput = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);

        if (files.length > 0) {
            await handleGalleryFiles(files);
        }

        event.target.value = "";
    };

    const handleMainDrop = async (event: DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setIsMainDragActive(false);

        const files = Array.from(event.dataTransfer.files ?? []);

        if (files.length > 0) {
            await handleMainImageFiles(files);
        }
    };

    const handleGalleryDrop = async (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsGalleryDragActive(false);

        const files = Array.from(event.dataTransfer.files ?? []);

        if (files.length > 0) {
            await handleGalleryFiles(files);
        }
    };

    const appendAssetToGallery = (image: string) => {
        if (galleryImages.includes(image) || image === mainImage) {
            return;
        }

        onGalleryImagesChange([...galleryImages, image]);
    };

    const removeGalleryImage = (image: string) => {
        onGalleryImagesChange(galleryImages.filter((item) => item !== image));
    };

    return (
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
                <label
                    className={[
                        "grid min-h-72 cursor-pointer place-items-center overflow-hidden rounded-[1.45rem] border-2 border-dashed bg-stone-50/70 p-4 transition",
                        isMainDragActive ? "border-[#b54f32] bg-[#fff7f4]" : "border-stone-200 hover:border-[#d8b4a7] hover:bg-white",
                        mainImageError ? "border-[#b54f32]" : ""
                    ].join(" ")}
                    onDragOver={(event) => {
                        event.preventDefault();
                        setIsMainDragActive(true);
                    }}
                    onDragLeave={() => setIsMainDragActive(false)}
                    onDrop={handleMainDrop}
                >
                    <input
                        ref={mainInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleMainImageInput}
                    />

                    {mainImage ? (
                        <div className="w-full">
                            <img
                                src={mainImage}
                                alt="Main listing preview"
                                className="h-64 w-full rounded-[1.2rem] object-cover"
                            />
                            <div className="mt-4 flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        mainInputRef.current?.click();
                                    }}
                                    className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-slate-950 hover:bg-stone-50"
                                >
                                    <UploadIcon className="h-4 w-4" />
                                    Replace image
                                </button>
                                <button
                                    type="button"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        onMainImageChange("");
                                    }}
                                    className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-[#b54f32] hover:text-[#8f3c28]"
                                >
                                    <TrashIcon className="h-4 w-4" />
                                    Remove image
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#8f3c28] shadow-[0_10px_24px_rgba(181,79,50,0.12)]">
                                <UploadIcon className="h-5 w-5" />
                            </span>
                            <h3 className="mt-4 text-base font-semibold text-slate-950">Upload main image</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                Drag and drop an image here or tap to choose one.
                            </p>
                            <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                                JPG, PNG, WEBP
                            </p>
                        </div>
                    )}
                </label>
                {mainImageError ? (
                    <p className="text-sm text-[#8f3c28]">{mainImageError}</p>
                ) : null}

                <div
                    className={[
                        "rounded-[1.45rem] border border-dashed bg-stone-50/70 p-4 transition",
                        isGalleryDragActive ? "border-[#b54f32] bg-[#fff7f4]" : "border-stone-200"
                    ].join(" ")}
                    onDragOver={(event) => {
                        event.preventDefault();
                        setIsGalleryDragActive(true);
                    }}
                    onDragLeave={() => setIsGalleryDragActive(false)}
                    onDrop={handleGalleryDrop}
                >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Additional images</h3>
                            <p className="mt-1 text-sm text-slate-600">Optional gallery previews for the listing.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => galleryInputRef.current?.click()}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-slate-950 hover:bg-stone-50"
                        >
                            <PlusIcon className="h-4 w-4" />
                            Add images
                        </button>
                    </div>
                    <input
                        ref={galleryInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleGalleryInput}
                    />

                    {previewGallery.length > 0 ? (
                        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {previewGallery.map((image) => (
                                <div key={image} className="overflow-hidden rounded-[1.15rem] border border-stone-200 bg-white">
                                    <img src={image} alt="Gallery preview" className="h-28 w-full object-cover" />
                                    <div className="flex items-center justify-between gap-2 p-2">
                                        <span className="truncate text-[12px] font-medium text-slate-600">
                                            {image === mainImage ? "Main image" : "Gallery image"}
                                        </span>
                                        {image === mainImage ? null : (
                                            <button
                                                type="button"
                                                onClick={() => removeGalleryImage(image)}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-stone-300 text-slate-700 transition hover:border-[#b54f32] hover:text-[#8f3c28]"
                                                aria-label="Remove gallery image"
                                            >
                                                <TrashIcon className="h-3.5 w-3.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="mt-4 text-sm text-stone-500">No gallery images added yet.</p>
                    )}
                </div>
            </div>

            <div className="rounded-[1.45rem] border border-stone-200 bg-stone-50/70 p-4">
                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Asset library</h3>
                    <p className="mt-1 text-sm text-slate-600">Use existing website images for quick testing.</p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                    {assetImages.map((image) => {
                        const isSelectedMain = image === mainImage;
                        const isInGallery = galleryImages.includes(image);

                        return (
                            <div
                                key={image}
                                className={[
                                    "overflow-hidden rounded-[1.15rem] border bg-white",
                                    isSelectedMain ? "border-[#d8b4a7] shadow-[0_12px_24px_rgba(181,79,50,0.12)]" : "border-stone-200"
                                ].join(" ")}
                            >
                                <img src={image} alt="Asset option" className="h-24 w-full object-cover" />
                                <div className="grid gap-2 p-2">
                                    <button
                                        type="button"
                                        onClick={() => onMainImageChange(image)}
                                        className={[
                                            "inline-flex items-center justify-center rounded-full px-3 py-2 text-[12px] font-semibold transition",
                                            isSelectedMain ? "bg-[#b54f32] text-white" : "border border-stone-300 text-slate-900 hover:border-slate-950 hover:bg-stone-50"
                                        ].join(" ")}
                                    >
                                        {isSelectedMain ? "Main image" : "Use as main"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => appendAssetToGallery(image)}
                                        className="inline-flex items-center justify-center rounded-full border border-stone-300 px-3 py-2 text-[12px] font-semibold text-slate-900 transition hover:border-slate-950 hover:bg-stone-50"
                                    >
                                        {isInGallery ? "In gallery" : "Add to gallery"}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
