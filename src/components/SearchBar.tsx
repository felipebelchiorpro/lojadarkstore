"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import React, { useState, type ChangeEvent, type FormEvent } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

export default function SearchBar({ onSearch, initialQuery = "" }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault(); // Prevent default if used in a form
    onSearch(query);
  };
  
  // Handle search on button click
  const handleSearchClick = () => {
    onSearch(query);
  };

  return (
    // Using a div instead of form as per the unusual "no form onSubmit" constraint
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input
        type="text"
        placeholder="Buscar produtos..."
        value={query}
        onChange={handleInputChange}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        className="h-10 text-base md:text-sm"
        aria-label="Buscar produtos"
      />
      <Button type="button" onClick={handleSearchClick} aria-label="Buscar">
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}
