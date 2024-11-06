<?php

namespace wcf\system\file\processor;

final class ImageCropSize implements \JsonSerializable
{
    public function __construct(
        public readonly int $width,
        public readonly int $height
    ) {
        if ($width <= 0 || $height <= 0) {
            throw new \OutOfRangeException("The width and height values must be larger than 0.");
        }
    }

    public function aspectRatio(): float
    {
        return $this->width / $this->height;
    }

    #[\Override]
    public function jsonSerialize(): mixed
    {
        return [
            'width' => $this->width,
            'height' => $this->height,
        ];
    }
}