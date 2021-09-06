import { useState, useEffect } from "react";

import { Header } from "../../components/Header";
import api from "../../services/api";
import { Food } from "../../components/Food";
import { ModalAddFood } from "../../components/ModalAddFood";
import { ModalEditFood } from "../../components/ModalEditFood";
import { FoodsContainer } from "./styles";

interface FoodItem {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  available: boolean;
}

export function Dashboard(): JSX.Element {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [editingFood, setEditingFood] = useState<FoodItem | undefined>();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    api.get("/foods").then((response) => setFoods(response.data));
  }, []);

  function handleAddFood(food: FoodItem) {
    api
      .post("/foods", {
        ...food,
        available: true,
      })
      .then((response) => setFoods([...foods, response.data]))
      .catch((err) => console.error(err));
  }

  function handleUpdateFood(food: FoodItem) {
    if (!editingFood) return;

    api
      .put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      })
      .then((response) => {
        const foodsUpdated = foods.map((food: FoodItem) =>
          food.id !== response.data.id ? food : response.data
        );
        setFoods(foodsUpdated);
      })
      .catch((err) => console.error(err));
  }

  function handleDeleteFood(id: string) {
    api.delete(`/foods/${id}`).then(() => {
      const foodsFiltered = foods.filter((food) => food.id !== id);

      setFoods(foodsFiltered);
    });
  }

  function toggleModal() {
    setAddModalOpen(!addModalOpen);
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: FoodItem) {
    setEditingFood(food);
    setEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={addModalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      {editingFood && (
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />
      )}

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}
