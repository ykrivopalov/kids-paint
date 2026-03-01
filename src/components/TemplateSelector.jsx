import React from 'react';
import star from '../assets/templates/star.svg';
import heart from '../assets/templates/heart.svg';
import flower from '../assets/templates/flower.svg';
import car from '../assets/templates/car.svg';
import cat from '../assets/templates/cat.svg';
import house from '../assets/templates/house.svg';
import rocket from '../assets/templates/rocket.svg';
import tree from '../assets/templates/tree.svg';
import sun from '../assets/templates/sun.svg';

const TEMPLATES = [
    { id: 'star', src: star, name: 'Звезда' },
    { id: 'heart', src: heart, name: 'Сердце' },
    { id: 'flower', src: flower, name: 'Цветок' },
    { id: 'car', src: car, name: 'Машинка' },
    { id: 'cat', src: cat, name: 'Котик' },
    { id: 'house', src: house, name: 'Домик' },
    { id: 'rocket', src: rocket, name: 'Ракета' },
    { id: 'tree', src: tree, name: 'Дерево' },
    { id: 'sun', src: sun, name: 'Солнышко' },
];

const TemplateSelector = ({ activeTemplate, onSelect }) => {
    return (
        <div className="template-selector">
            <div className="section-label">Раскраски</div>
            <div className="template-list">
                <button
                    className={`template-btn ${!activeTemplate ? 'selected' : ''}`}
                    onClick={() => onSelect(null)}
                    title="Пустой лист"
                >
                    ⬜
                </button>
                {TEMPLATES.map((t) => (
                    <button
                        key={t.id}
                        className={`template-btn ${activeTemplate === t.src ? 'selected' : ''}`}
                        onClick={() => onSelect(t.src)}
                        title={t.name}
                    >
                        <img src={t.src} alt={t.name} style={{ width: '100%', height: '100%' }} />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TemplateSelector;
