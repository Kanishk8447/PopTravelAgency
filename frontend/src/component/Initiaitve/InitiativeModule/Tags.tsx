import React from 'react';
import { notification } from '../../../service/notification-Service';

interface Tag {
  key: string;
  value: string;
}

interface TagsProps {
  formValues: {
    tags: Tag[];
    [key: string]: any;
  };
  handleChange: (field: string, value: Tag[] | any) => void;
}

interface TagInputProps {
  tag: Tag;
  index: number;
  isLast: boolean;
  isOnly: boolean;
  onTagChange: (index: number, field: keyof Tag, value: string) => void;
  onDelete: (index: number) => void;
  onAdd: () => void;
}

const TagInput: React.FC<TagInputProps> = ({
  tag,
  index,
  isLast,
  isOnly,
  onTagChange,
  onDelete,
  onAdd
}) => (
  <div className="row mb-3 align-items-center" key={index}>
    <div className="col-md-5 d-flex justify-content-center align-items-center">
      <input
        style={{ maxWidth: '250px' }}
        type="text"
        className="form-control"
        placeholder="Enter key"
        value={tag.key}
        onChange={(e) => onTagChange(index, 'key', e.target.value)}
        aria-label={`Tag key ${index + 1}`}
      />
    </div>
    <div className="col-md-5 d-flex">
      <input
        style={{ maxWidth: '250px' }}
        type="text"
        className="form-control"
        placeholder="Enter value"
        value={tag.value}
        onChange={(e) => onTagChange(index, 'value', e.target.value)}
        aria-label={`Tag value ${index + 1}`}
      />
      <div className="col-md-2 d-flex">
        <button
          style={{ maxHeight: '40px' }}
          className="btn btn-danger me-2 d-flex justify-content-center align-items-center"
          onClick={() => onDelete(index)}
          disabled={isOnly}
          aria-label={`Delete tag ${index + 1}`}>
          <span className="material-symbols-outlined">delete</span>
        </button>
        {isLast && (
          <button
            style={{ maxHeight: '40px' }}
            type="button"
            className="btn btn-success d-flex justify-content-center align-items-center"
            onClick={onAdd}
            aria-label="Add new tag">
            <span className="material-symbols-outlined">add</span>
          </button>
        )}
      </div>
    </div>
  </div>
);

const Tags: React.FC<TagsProps> = ({ formValues, handleChange }) => {
  const tags: Tag[] =
    Array.isArray(formValues.tags) && formValues.tags.length > 0
      ? formValues.tags
      : [{ key: '', value: '' }];

  // Helper function to filter out empty tags
  const filterEmptyTags = (tagsArray: Tag[]): Tag[] => {
    return tagsArray.filter((tag) => tag.key.trim() !== '' || tag.value.trim() !== '');
  };

  // const isKeyUnique = (key: string, index: number): boolean => {
  //   return tags.findIndex((tag, i) => tag.key === key && i !== index) === -1;
  // };

  const handleAddTag = (): void => {
    try {
      if (tags.length >= 10) {
        notification('error', 'You can only add up to 10 tags');
        return;
      }

      // const newTag = { key: '', value: '' };
      // const newTags = [...tags, newTag];
      const newTags = [...tags, { key: '', value: '' }];

      handleChange('tags', newTags);
    } catch (error) {
      console.error('Error adding tag:', error);
    }
  };

  const handleDeleteTag = (index: number): void => {
    try {
      if (tags.length <= 1) return;
      const newTags = tags.filter((_, i) => i !== index);
      const filteredTags = filterEmptyTags(newTags);
      // Ensure at least one tag remains
      handleChange('tags', filteredTags.length > 0 ? filteredTags : [{ key: '', value: '' }]);
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
  };

  const handleTagsChange = (index: number, field: keyof Tag, value: string): void => {
    try {
      // if (field === 'key' && !isKeyUnique(value, index)) {
      //   notification('error', 'Key must be unique');
      //   return;
      // }

      const newTags = [...tags];
      newTags[index] = {
        ...newTags[index],
        [field]: value
      };
      // Only filter empty tags when updating, keep empty inputs visible
      const filteredTags = filterEmptyTags(newTags);
      handleChange('tags', filteredTags.length > 0 ? newTags : [{ key: '', value: '' }]);
    } catch (error) {
      console.error('Error updating tag:', error);
    }
  };

  return (
    <div className="card-body col-md-12 px-4 byouc-inputcard mt-4">
      <div className="col-md-12 px-0 mb-4">
        <div className="row mb-3">
          <div className="col-md-5 d-flex justify-content-center">
            <label className="fw-bold">Key</label>
          </div>
          <div className="col-md-5  d-flex justify-content-center " style={{ maxWidth: '20%' }}>
            <label className="fw-bold">Value</label>
          </div>
          <div className="col-md-2" aria-hidden="true" />
        </div>
        {tags.map((tag, index) => (
          <TagInput
            key={index}
            tag={tag}
            index={index}
            isLast={index === tags.length - 1}
            isOnly={tags.length === 1}
            onTagChange={handleTagsChange}
            onDelete={handleDeleteTag}
            onAdd={handleAddTag}
          />
        ))}
      </div>
    </div>
  );
};

export default Tags;
