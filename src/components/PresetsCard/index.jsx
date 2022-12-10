import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import { activatePreset, addPreset, removePreset } from 'modules/presets';

// CONSTANT display categories
export const DEFAULT_CAT = 'default_presets';
export const CUSTOM_CAT = 'custom_presets';

const useStyles = makeStyles(theme => ({
    content: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        padding: theme.spacing(2),
        paddingBottom: 0,
    },
    presetButton: {
        margin: theme.spacing(1),
        textDecoration: 'none',
    },
    buttonGrid: {
        direction: 'row',
    },
    actions: {
        display: 'flex',
        flexDirection: 'row',
        paddingBottom: theme.spacing(3),
    },
}));

const PresetsCard = ({ display, presets, effect, getEffectPresets }) => {
    const classes = useStyles();
    const [name, setName] = useState('');
    const isNameValid = validateTextInput(name, presets);
    const dispatch = useDispatch();

    useEffect(() => {
        getEffectPresets(effect.type);
    }, [effect.type, getEffectPresets]);

    const handleActivatePreset = (displayId, category, type, presetId) => () => {
        dispatch(activatePreset(displayId, category, type, presetId));
        setName('');
    };

    const renderPresetsButton = (list, CATEGORY) => {
        if (!list?.length)
            return (
                <Button className={classes.presetButton} disabled>
                    No Saved Presets
                </Button>
            );
        return list.map(preset => {
            return (
                <Grid item key={preset.id}>
                    <Button
                        className={classes.presetButton}
                        onClick={handleActivatePreset(
                            display.id,
                            CATEGORY,
                            presets.effectType,
                            preset.id
                        )}
                        onDoubleClick={handleRemovePreset(effect.type, preset.id)}
                    >
                        {preset.name}
                    </Button>
                </Grid>
            );
        });
    };

    const handleAddPreset = () => dispatch(addPreset(display.id, name));
    const handleRemovePreset = (effectId, presetId) => () => dispatch(removePreset(effectId, {
        preset_id: presetId,
        category: "user_presets"
    }));

    return (
        <Card variant="outlined" style={{ marginBottom: '2rem' }}>
            <CardHeader title="Presets" subheader="Explore different effect configurations" />
            <CardContent className={classes.content}>
                <Typography variant="subtitle2">LedFx Presets</Typography>
                <Grid container className={classes.buttonGrid}>
                    {renderPresetsButton(presets?.defaultPresets, DEFAULT_CAT)}
                </Grid>
                <Typography variant="subtitle2">My Presets</Typography>
                <Grid container className={classes.buttonGrid}>
                    {renderPresetsButton(presets?.customPresets, CUSTOM_CAT)}
                </Grid>
                <Typography variant="h6">Add Preset</Typography>
                <Typography variant="body1" color="textSecondary">
                    Save this effect configuration as a preset
                </Typography>
            </CardContent>
            <CardActions className={classes.actions}>
                <TextField
                    error={!isNameValid}
                    id="presetNameInput"
                    label="Preset Name"
                    onChange={e => setName(e.target.value)}
                />
                <Button
                    className={classes.presetButton}
                    color="primary"
                    aria-label="Save Preset"
                    disabled={name.length === 0 || !isNameValid}
                    variant="contained"
                    onClick={handleAddPreset}
                    endIcon={<SaveIcon />}
                >
                    Save Preset
                </Button>
            </CardActions>
        </Card>
    );
};

const validateTextInput = (input, presets) => {
    const used = presets.customPresets.concat(presets.defaultPresets);
    return !used.some(p => p.name === input);
};

export default PresetsCard;
