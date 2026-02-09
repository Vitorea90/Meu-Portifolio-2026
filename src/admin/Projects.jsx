import React, { useState } from 'react';
import { useVercelProjects } from '../hooks/useVercel';

const Projects = () => {
    const [projects, setProjects, loading] = useVercelProjects();
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        techStack: '',
        link: '',
        github: '',
        image: '',
        images: []
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const projectData = {
            ...formData,
            techStack: formData.techStack.split(',').map(t => t.trim()).filter(t => t),
            image: formData.images && formData.images.length > 0 ? formData.images[0] : formData.image
        };
        // ... existing logic ...
        if (editingId) {
            setProjects.upsert({
                id: editingId,
                ...projectData
            });
            setEditingId(null);
        } else {
            const newProject = {
                id: Date.now(),
                ...projectData,
                date: new Date().toISOString()
            };
            setProjects.upsert(newProject);
        }

        resetForm();
    };

    const handleEdit = (project) => {
        setFormData({
            title: project.title || '',
            description: project.description || '',
            techStack: Array.isArray(project.techStack) ? project.techStack.join(', ') : (project.techStack || ''),
            link: project.link || '',
            github: project.github || '',
            image: project.image || '',
            images: project.images || (project.image ? [project.image] : [])
        });
        setEditingId(project.id);
        setIsAdding(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id) => {
        if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
            setProjects.delete(id);
        }
    };

    const resetForm = () => {
        setFormData({ title: '', description: '', techStack: '', link: '', github: '', image: '', images: [] });
        setIsAdding(false);
        setEditingId(null);
    };

    return (
        <div className="projects-container">
            <div className="section-header">
                <h2 className="section-title">Projetos</h2>
                {!isAdding && (
                    <button onClick={() => setIsAdding(true)} className="btn btn-primary">
                        + Adicionar Projeto
                    </button>
                )}
            </div>

            {isAdding && (
                <div className="form-card">
                    <h3 className="form-title">
                        {editingId ? 'Editar Projeto' : 'Novo Projeto'}
                    </h3>
                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="form-group">
                            <label>Título</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Nome do projeto"
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Descrição</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Descreva seu projeto..."
                                rows="4"
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Tecnologias (separadas por vírgula)</label>
                            <input
                                type="text"
                                value={formData.techStack}
                                onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                                placeholder="React, Node.js, MongoDB"
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Link do Projeto</label>
                                <input
                                    type="url"
                                    value={formData.link}
                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                    placeholder="https://..."
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>GitHub</label>
                                <input
                                    type="url"
                                    value={formData.github}
                                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                    placeholder="https://github.com/..."
                                    className="form-input"
                                />
                            </div>
                        </div>


                        <div className="form-group">
                            <label>Imagens do Projeto (A primeira será a capa)</label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                    const files = Array.from(e.target.files);
                                    if (files.length > 0) {
                                        const newImages = [];
                                        let processedCount = 0;

                                        files.forEach(file => {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                newImages.push(reader.result);
                                                processedCount++;
                                                if (processedCount === files.length) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        images: [...(prev.images || []), ...newImages],
                                                        image: prev.image || newImages[0] // Set cover if empty
                                                    }));
                                                }
                                            };
                                            reader.readAsDataURL(file);
                                        });
                                    }
                                }}
                                className="form-input"
                            />
                            <div className="image-preview-grid">
                                {formData.images && formData.images.map((img, index) => (
                                    <div key={index} className="image-preview-item">
                                        <img src={img} alt={`Preview ${index}`} />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newImages = formData.images.filter((_, i) => i !== index);
                                                setFormData({
                                                    ...formData,
                                                    images: newImages,
                                                    image: index === 0 ? (newImages[0] || '') : formData.image
                                                });
                                            }}
                                            className="btn-remove-image"
                                        >
                                            ×
                                        </button>
                                        {index === 0 && <span className="cover-badge">Capa</span>}
                                    </div>
                                ))}
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

            <div className="projects-grid">
                {projects.map((project) => (
                    <div key={project.id} className="project-card">
                        {project.image && (
                            <div className="project-image">
                                <img src={project.image} alt={project.title} />
                            </div>
                        )}
                        <div className="project-content">
                            <h3 className="project-title">{project.title}</h3>
                            <p className="project-description">{project.description}</p>
                            <div className="project-tech">
                                {Array.isArray(project.techStack) ? project.techStack.map((tech, index) => (
                                    <span key={index} className="tech-tag">{tech}</span>
                                )) : <span className="tech-tag">{project.techStack}</span>}
                            </div>
                            <div className="project-links">
                                {project.link && (
                                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                                        🔗 Ver Projeto
                                    </a>
                                )}
                                {project.github && (
                                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link">
                                        💻 GitHub
                                    </a>
                                )}
                            </div>
                        </div>
                        <div className="project-actions">
                            <button onClick={() => handleEdit(project)} className="btn-small btn-edit">
                                ✏️ Editar
                            </button>
                            <button onClick={() => handleDelete(project.id)} className="btn-small btn-danger">
                                🗑️ Excluir
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {projects.length === 0 && !isAdding && (
                <div className="empty-state">
                    <span className="empty-icon">🚀</span>
                    <p className="empty-title">Nenhum projeto cadastrado</p>
                    <p className="empty-text">Adicione seus projetos para mostrar no portfólio</p>
                </div>
            )}
        </div>
    );
};

export default Projects;
