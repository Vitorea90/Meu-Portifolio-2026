import React, { useState } from 'react';
import { useVercelSkills } from '../hooks/useVercel';

const Skills = () => {
    const [skills, setSkills, loading] = useVercelSkills();
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Frontend',
        proficiency: 50
    });

    const categories = ['Frontend', 'Backend', 'Language', 'Tool', 'Database', 'Other'];

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingId) {
            // Update existing skill
            setSkills(skills.map(skill =>
                skill.id === editingId ? { ...skill, ...formData } : skill
            ));
            setEditingId(null);
        } else {
            // Add new skill
            const newSkill = {
                id: Date.now(),
                ...formData
            };
            setSkills([...skills, newSkill]);
        }

        resetForm();
    };

    const handleEdit = (skill) => {
        setFormData({
            name: skill.name,
            category: skill.category,
            proficiency: skill.proficiency
        });
        setEditingId(skill.id);
        setIsAdding(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta habilidade?')) {
            setSkills(skills.filter(skill => skill.id !== id));
        }
    };

    const resetForm = () => {
        setFormData({ name: '', category: 'Frontend', proficiency: 50 });
        setIsAdding(false);
        setEditingId(null);
    };

    return (
        <div className="skills-container">
            <div className="section-header">
                <h2 className="section-title">Habilidades & Tecnologias</h2>
                {!isAdding && (
                    <button onClick={() => setIsAdding(true)} className="btn btn-primary">
                        + Adicionar Habilidade
                    </button>
                )}
            </div>

            {isAdding && (
                <div className="form-card">
                    <h3 className="form-card-title">
                        {editingId ? 'Editar Habilidade' : 'Nova Habilidade'}
                    </h3>
                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Nome</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ex: React, Node.js"
                                    required
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Categoria</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="form-input"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>



                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">
                                {editingId ? 'Salvar' : 'Adicionar'}
                            </button>
                            <button type="button" onClick={resetForm} className="btn btn-secondary">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="skills-grid">
                {skills.map((skill) => (
                    <div key={skill.id} className="skill-card">
                        <div className="skill-header">
                            <h3 className="skill-name">{skill.name}</h3>
                            <span className="skill-category">{skill.category}</span>
                        </div>

                        <div className="skill-actions">
                            <button onClick={() => handleEdit(skill)} className="btn-small">
                                ✏️ Editar
                            </button>
                            <button onClick={() => handleDelete(skill.id)} className="btn-small btn-danger">
                                🗑️ Excluir
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {skills.length === 0 && !isAdding && (
                <div className="empty-state">
                    <span className="empty-icon">💡</span>
                    <p className="empty-title">Nenhuma habilidade cadastrada</p>
                    <p className="empty-text">Adicione suas habilidades e tecnologias</p>
                </div>
            )}
        </div>
    );
};

export default Skills;
