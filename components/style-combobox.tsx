"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const presetStyles = [
  { value: "fontawesome", label: "FontAwesome" },
  { value: "feather", label: "Feather" },
  { value: "material", label: "Material Symbols" },
  { value: "tabler", label: "Tabler" },
  { value: "heroicons", label: "Heroicons" },
  { value: "phosphor", label: "Phosphor" },
  { value: "lucide", label: "Lucide" },
  { value: "ionicons", label: "Ionicons" },
  { value: "bootstrap", label: "Bootstrap" },
]

interface StyleComboboxProps {
  value: string
  onValueChange: (value: string) => void
}

export function StyleCombobox({ value, onValueChange }: StyleComboboxProps) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const selectedPreset = presetStyles.find((style) => style.value === value)
  const displayValue = selectedPreset ? selectedPreset.label : value

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {displayValue || "スタイルを選択または入力..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder="スタイルを検索または入力..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>
              <button
                className="w-full text-left px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                onClick={() => {
                  onValueChange(searchValue)
                  setOpen(false)
                  setSearchValue("")
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    onValueChange(searchValue)
                    setOpen(false)
                    setSearchValue("")
                  }
                }}
              >
                "{searchValue}" を使用
              </button>
            </CommandEmpty>
            <CommandGroup>
              {presetStyles.map((style) => (
                <CommandItem
                  key={style.value}
                  value={style.value}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue)
                    setOpen(false)
                    setSearchValue("")
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === style.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {style.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}