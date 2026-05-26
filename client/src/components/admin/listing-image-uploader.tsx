import { useRef, useState, type ChangeEvent, type DragEvent } from "react";

import { uploadListingImage } from "../../modules/site-data/site-data.service";
import { ApiError } from "../../modules/core/api-client";
import { ChevronDownIcon, PlusIcon, TrashIcon, UploadIcon } from "../ui/site-icon";

interface ListingImageUploaderProps {
    mainImage: string;
    galleryImages: string[];
    assetImages: string[];
    mainImageError?: string;
    onMainImageChange: (image: string) => void;
    onGalleryImagesChange: (images: string[]) => void;
}

const MAX_IMAGE_DIMENSION = 2200;
const WEBP_QUALITY = 0.9;

function loadImage(file: File) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        const objectUrl = URL.createObjectURL(file);

        image.onload = () => {
            URL.revokeObjectURL(objectUrl);
            resolve(image);
        };

        image.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error(`Unable to load ${file.name}.`));
        };

        image.src = objectUrl;
    });
}

function getScaledDimensions(width: number, height: number) {
    const largestSide = Math.max(width, height);

    if (largestSide <= MAX_IMAGE_DIMENSION) {
        return { width, height };
    }

    const scale = MAX_IMAGE_DIMENSION / largestSide;

    return {
        width: Math.max(1, Math.round(width * scale)),
        height: Math.max(1, Math.round(height * scale))
    };
}

async function convertFileToWebp(file: File) {
    try {
        const image = await loadImage(file);
        const { width, height } = getScaledDimensions(image.naturalWidth, image.naturalHeight);
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
            return file;
        }

        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, 0, 0, width, height);

        const blob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob(resolve, "image/webp", WEBP_QUALITY);
        });

        if (!blob) {
            return file;
        }

        const baseName = file.name.replace(/\.[^.]+$/, "");

        return new File([blob], `${baseName || "listing-image"}.webp`, {
            type: "image/webp",
            lastModified: Date.now()
        });
    } catch {
        return file;
    }
}

function uniqueImages(images: string[]) {
    return images.filter((image, index, items) => image && items.indexOf(image) === index);
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
    const [isAssetLibraryOpen, setIsAssetLibraryOpen] = useState(false);
    const [uploadState, setUploadState] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const previewGallery = uniqueImages([mainImage, ...galleryImages]);

    const updateGalleryImages = (images: string[]) => {
        onGalleryImagesChange(uniqueImages(images).filter((image) => image !== mainImage));
    };

    const replaceMainImage = (image: string) => {
        onMainImageChange(image);
        onGalleryImagesChange(uniqueImages(galleryImages.filter((item) => item !== image)));
    };

    const promoteGalleryImage = (image: string) => {
        onMainImageChange(image);
        onGalleryImagesChange(uniqueImages([mainImage, ...galleryImages.filter((item) => item !== image)]).filter(Boolean));
    };

    const uploadFiles = async (files: File[]) => {
        const imageFiles = files.filter((file) => file.type.startsWith("image/"));

        return Promise.all(imageFiles.map(async (file) => {
            const optimizedFile = await convertFileToWebp(file);
            const upload = await uploadListingImage(optimizedFile);

            return upload.url;
        }));
    };

    const handleMainImageFiles = async (files: File[]) => {
        setUploadError(null);
        setUploadState("Optimizing and uploading cover photo...");

        try {
            const [image, ...extraImages] = await uploadFiles(files);

            if (!image) {
                return;
            }

            onMainImageChange(image);

            if (extraImages.length > 0) {
                onGalleryImagesChange(uniqueImages([...galleryImages, ...extraImages]).filter((item) => item !== image));
            }
        } catch (error) {
            if (error instanceof ApiError) {
                setUploadError(error.message);
            } else {
                setUploadError("Unable to upload image right now.");
            }
        } finally {
            setUploadState(null);
        }
    };

    const handleGalleryFiles = async (files: File[]) => {
        setUploadError(null);
        setUploadState("Optimizing and uploading photos...");

        try {
            const images = await uploadFiles(files);

            updateGalleryImages([...galleryImages, ...images.filter(Boolean)]);
        } catch (error) {
            if (error instanceof ApiError) {
                setUploadError(error.message);
            } else {
                setUploadError("Unable to upload images right now.");
            }
        } finally {
            setUploadState(null);
        }
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

        updateGalleryImages([...galleryImages, image]);
    };

    const removeGalleryImage = (image: string) => {
        updateGalleryImages(galleryImages.filter((item) => item !== image));
    };

    const removeMainImage = () => {
        if (galleryImages.length > 0) {
            const [nextMainImage, ...nextGalleryImages] = galleryImages;

            onMainImageChange(nextMainImage);
            onGalleryImagesChange(nextGalleryImages);
            return;
        }

        onMainImageChange("");
    };

    return (
        <div className="space-y-4">
            <input
                ref={mainInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                    void handleMainImageInput(event);
                }}
            />
            <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(event) => {
                    void handleGalleryInput(event);
                }}
            />

            <div className="rounded-[1.55rem] border border-stone-200 bg-[linear-gradient(180deg,rgba(251,250,247,1),rgba(247,242,235,0.96))] p-4 shadow-[0_14px_34px_rgba(15,23,42,0.05)] sm:p-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h3 className="text-base font-semibold text-slate-950">Listing photos</h3>
                        <p className="mt-1 text-sm text-slate-600">Cover first. Add extra photos only when needed.</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => mainInputRef.current?.click()}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
                        >
                            <UploadIcon className="h-4 w-4" />
                            {mainImage ? "Replace cover" : "Upload cover"}
                        </button>
                        <button
                            type="button"
                            onClick={() => galleryInputRef.current?.click()}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-slate-950 hover:bg-stone-50"
                        >
                            <PlusIcon className="h-4 w-4" />
                            Add photos
                        </button>
                        {mainImage ? (
                            <button
                                type="button"
                                onClick={removeMainImage}
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-[#b54f32] hover:text-[#8f3c28]"
                            >
                                <TrashIcon className="h-4 w-4" />
                                Remove cover
                            </button>
                        ) : null}
                    </div>
                </div>

                <label
                    className={[
                        "mt-4 block cursor-pointer overflow-hidden rounded-[1.35rem] border border-dashed transition",
                        isMainDragActive || isGalleryDragActive
                            ? "border-[#b54f32] bg-[#fff7f4]"
                            : "border-stone-200 bg-white/85 hover:border-[#d8b4a7]",
                        mainImageError ? "border-[#b54f32]" : ""
                    ].join(" ")}
                    onClick={() => mainInputRef.current?.click()}
                    onDragOver={(event) => {
                        event.preventDefault();
                        setIsMainDragActive(true);
                    }}
                    onDragLeave={() => setIsMainDragActive(false)}
                    onDrop={(event) => {
                        void handleMainDrop(event);
                    }}
                >
                    {mainImage ? (
                        <div className="relative">
                            <img
                                src={mainImage}
                                alt="Cover listing preview"
                                className="h-72 w-full object-cover sm:h-80"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/28 via-transparent to-transparent" />
                            <div className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-950 shadow-sm">
                                Cover photo
                            </div>
                            <div className="absolute bottom-4 left-4 rounded-full bg-slate-950/75 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur">
                                Drop a new image here to replace it
                            </div>
                        </div>
                    ) : (
                        <div className="grid min-h-72 place-items-center px-5 py-10 text-center">
                            <div>
                                <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#8f3c28] shadow-[0_10px_24px_rgba(181,79,50,0.12)]">
                                    <UploadIcon className="h-5 w-5" />
                                </span>
                                <h4 className="mt-4 text-base font-semibold text-slate-950">Upload cover photo</h4>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    Drag a photo here or tap upload cover.
                                </p>
                            </div>
                        </div>
                    )}
                </label>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-700">
                        {previewGallery.length} {previewGallery.length === 1 ? "photo" : "photos"}
                    </span>
                    <span className="text-sm text-stone-500">New uploads are optimized to WEBP automatically.</span>
                    {uploadState ? <span className="text-sm font-medium text-[#8f3c28]">{uploadState}</span> : null}
                </div>

                {mainImageError ? <p className="mt-3 text-sm text-[#8f3c28]">{mainImageError}</p> : null}
                {uploadError ? <p className="mt-3 text-sm text-[#8f3c28]">{uploadError}</p> : null}

                <div
                    className={[
                        "mt-4 rounded-[1.25rem] border border-dashed p-3 transition sm:p-4",
                        isGalleryDragActive ? "border-[#b54f32] bg-[#fff7f4]" : "border-stone-200 bg-white/78"
                    ].join(" ")}
                    onDragOver={(event) => {
                        event.preventDefault();
                        setIsGalleryDragActive(true);
                    }}
                    onDragLeave={() => setIsGalleryDragActive(false)}
                    onDrop={(event) => {
                        void handleGalleryDrop(event);
                    }}
                >
                    {previewGallery.length > 0 ? (
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            {previewGallery.map((image) => {
                                const isMainImage = image === mainImage;

                                return (
                                    <div key={image} className="overflow-hidden rounded-[1.1rem] border border-stone-200 bg-white">
                                        <img
                                            src={image}
                                            alt={isMainImage ? "Cover preview" : "Listing preview"}
                                            className="h-32 w-full object-cover"
                                        />
                                        <div className="space-y-2 p-3">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="truncate text-[12px] font-semibold text-slate-700">
                                                    {isMainImage ? "Cover photo" : "Gallery photo"}
                                                </span>
                                                <span className="rounded-full bg-stone-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500">
                                                    {isMainImage ? "Main" : "Extra"}
                                                </span>
                                            </div>

                                            {isMainImage ? null : (
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => promoteGalleryImage(image)}
                                                        className="inline-flex flex-1 items-center justify-center rounded-full border border-stone-300 px-3 py-2 text-[12px] font-semibold text-slate-900 transition hover:border-slate-950 hover:bg-stone-50"
                                                    >
                                                        Make cover
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeGalleryImage(image)}
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 text-slate-700 transition hover:border-[#b54f32] hover:text-[#8f3c28]"
                                                        aria-label="Remove gallery image"
                                                    >
                                                        <TrashIcon className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-[1rem] bg-stone-50 px-4 py-5 text-sm text-stone-500">
                            Extra photos will appear here.
                        </div>
                    )}
                </div>
            </div>

            <div className="rounded-[1.35rem] border border-stone-200 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.04)]">
                <button
                    type="button"
                    onClick={() => setIsAssetLibraryOpen((value) => !value)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left sm:px-5"
                    aria-expanded={isAssetLibraryOpen}
                >
                    <span>
                        <span className="block text-sm font-semibold text-slate-950">Use existing assets</span>
                        <span className="mt-1 block text-sm text-stone-500">Pick from the current website images when needed.</span>
                    </span>
                    <ChevronDownIcon
                        className={[
                            "h-4 w-4 text-stone-500 transition",
                            isAssetLibraryOpen ? "rotate-180" : ""
                        ].join(" ")}
                    />
                </button>

                {isAssetLibraryOpen ? (
                    <div className="border-t border-stone-200 px-4 py-4 sm:px-5">
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                            {assetImages.map((image) => {
                                const isSelectedMain = image === mainImage;
                                const isInGallery = galleryImages.includes(image);

                                return (
                                    <div
                                        key={image}
                                        className={[
                                            "overflow-hidden rounded-[1.05rem] border bg-stone-50/60",
                                            isSelectedMain ? "border-[#d8b4a7] shadow-[0_10px_22px_rgba(181,79,50,0.12)]" : "border-stone-200"
                                        ].join(" ")}
                                    >
                                        <img src={image} alt="Asset option" className="h-24 w-full object-cover" />
                                        <div className="grid gap-2 p-2.5">
                                            <button
                                                type="button"
                                                onClick={() => replaceMainImage(image)}
                                                className={[
                                                    "inline-flex items-center justify-center rounded-full px-3 py-2 text-[12px] font-semibold transition",
                                                    isSelectedMain ? "bg-[#b54f32] text-white" : "border border-stone-300 bg-white text-slate-900 hover:border-slate-950 hover:bg-stone-50"
                                                ].join(" ")}
                                            >
                                                {isSelectedMain ? "Cover photo" : "Use as cover"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => appendAssetToGallery(image)}
                                                className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-3 py-2 text-[12px] font-semibold text-slate-900 transition hover:border-slate-950 hover:bg-stone-50"
                                            >
                                                {isInGallery ? "Added" : "Add to gallery"}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
