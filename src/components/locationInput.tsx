import { useState, useRef, useCallback } from 'react';
import { Autocomplete } from '@react-google-maps/api';

const LocationInput = ({
    onPlaceChanged,
    targetNameErr,
    isEntryEditing,
    setIsEntryEditing
}) => {
    const [autocomplete, setAutocomplete] = useState(null);
    const inputRef = useRef(null);

    const handleLoad = useCallback((autocompleteInstance) => {
        setAutocomplete(autocompleteInstance);
    }, []);

    const handlePlaceChange = () => {
        if (!autocomplete) return;
        const place = autocomplete.getPlace();
        const formatted_address = place?.formatted_address;
        if (formatted_address) {
            onPlaceChanged(formatted_address);
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.value = "";
                    inputRef.current.focus();
                }
            }, 200);
        }
    };

    return (
        <div className="flex mt-2 items-center gap-2">
            <Autocomplete
                onLoad={handleLoad}
                onPlaceChanged={handlePlaceChange}
            >
                <input
                    ref={inputRef}
                    type="text"
                    className={`placeholder:text-sm placeholder:italic placeholder:text-[#8297BD] w-full bg-transparent border border-[#8297BD] rounded-md h-[40px] px-2 font-lighter text-[#FFFFFF] ${targetNameErr ? "border-nyx-red" : ""}`}
                    placeholder="Enter a location"
                />
            </Autocomplete>
            {isEntryEditing === 'loc' && (
                <span
                    className="border rounded-full h-max w-max px-1 text-xs text-[#c084fc] border-[#c084fc] cursor-pointer"
                    onClick={() => setIsEntryEditing('')}
                >
                    X
                </span>
            )}
        </div>
    );
};

export default LocationInput;
