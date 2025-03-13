import { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Dropdown } from "antd";
import { ExpandMore } from "@mui/icons-material";

const ColorDropdown = ({ selectedColor, onColorSelect }) => {
  const colors = [
    "none", "black","white","red","blue","green","yellow"
  ];

  const menu = (
    <div style={{ 
      display: "grid", 
      gridTemplateColumns: "repeat(5, 1fr)", 
      gap: "8px", 
      padding: "10px", 
      background: "#fff", 
      borderRadius: "8px", 
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)" 
    }}>
      {colors.map((color) => (
        <div
          key={color}
          style={{
            width: "30px",
            height: "30px",
            backgroundColor: color === "none" ? "transparent" : color,
            borderRadius: "4px",
            cursor: "pointer",
            border: selectedColor === color ? "2px solid #000" : "2px solid transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            color: "#333",
            fontWeight: "bold",
            border: "1px solid #ddd"
          }}
          onClick={() => onColorSelect(color === "none" ? "" : color)}
        >
          {color === "none" ? "None" : ""}
        </div>
      ))}
    </div>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
      <IconButton>
        <ExpandMore />
      </IconButton>
    </Dropdown>
  );
};

const ColorPicker = () => {
  const [filters, setFilters] = useState({ brand: "" });
  const [selectedColor, setSelectedColor] = useState("");

  return (
    <TextField
      label="Màu sắc"
      fullWidth
      value={selectedColor || "None"}
      margin="dense"
      InputProps={{
        startAdornment: selectedColor && (
          <InputAdornment position="start">
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: selectedColor,
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </InputAdornment>
        ),
        endAdornment: (
          <ColorDropdown
            selectedColor={selectedColor}
            onColorSelect={(color) => {
              setSelectedColor(color);
              setFilters({ ...filters, brand: color });
            }}
          />
        ),
      }}
    />
  );
};

export default ColorPicker;
