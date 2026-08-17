import { computed, inject } from '@angular/core';
import {
    signalStore,
    withComputed,
    withMethods,
    patchState,
    withState,
} from '@ngrx/signals';
import {
    withEntities,
    setAllEntities,
    updateEntity,
    addEntity,
    removeEntity,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, concatMap, tap, catchError, EMPTY, switchMap } from 'rxjs';
import { EnrollmentService } from '../services/enrollment.service';
import { Enrollment } from '../models/enrollment.model';

// Define the store state
export interface EnrollmentState {
    isLoading: boolean;
    error: string | null;
    selectedId: string | null;
}

export const EnrollmentStore = signalStore(
    { providedIn: 'root' },
    
    // State
    withState<EnrollmentState>({
        isLoading: false,
        error: null,
        selectedId: null,
    }),
    
    // Entities
    withEntities<Enrollment>(),
    
    // Computed signals
    withComputed((store) => ({
        pendingCount: computed(() => 
            store.entities().filter(e => e.status === 'Pending').length
        ),
        approvedCount: computed(() => 
            store.entities().filter(e => e.status === 'Approved').length
        ),
        rejectedCount: computed(() => 
            store.entities().filter(e => e.status === 'Rejected').length
        ),
        selectedEnrollment: computed(() => {
            const id = store.selectedId();
            return store.entityMap()[id || ''] || null;
        }),
    })),
    
    // Methods
    withMethods((store, api = inject(EnrollmentService)) => ({
        // Load all enrollments
        loadEnrollments: rxMethod<void>(
            pipe(
                tap(() => patchState(store, { isLoading: true, error: null })),
                concatMap(() => 
                    api.getAll().pipe(
                        tap((rows) => {
                            patchState(store, 
                                setAllEntities(rows),
                                { isLoading: false }
                            );
                        }),
                        catchError((err) => {
                            patchState(store, { 
                                isLoading: false, 
                                error: err.message || 'Failed to load enrollments' 
                            });
                            return EMPTY;
                        })
                    )
                )
            )
        ),
        
        // Add new enrollment (optimistic)
        addEnrollment: rxMethod<Enrollment>(
            pipe(
                tap((enrollment) => {
                    patchState(store, addEntity(enrollment));
                }),
                concatMap((enrollment) => 
                    // In real app, this would be a POST to create
                    // For now, just simulate success
                    api.getAll().pipe(
                        tap(() => {
                            // Success - keep the optimistic update
                        }),
                        catchError((err) => {
                            // Rollback on error
                            patchState(store, removeEntity(enrollment.id));
                            patchState(store, { error: 'Failed to add enrollment' });
                            return EMPTY;
                        })
                    )
                )
            )
        ),
        
        // Optimistic Approve
        approveEnrollment: rxMethod<string>(
            pipe(
                tap((id) => {
                    // Optimistic update
                    patchState(store, 
                        updateEntity({ 
                            id, 
                            changes: { status: 'Approved' } 
                        })
                    );
                }),
                concatMap((id) =>
                    api.approve(id).pipe(
                        catchError((err) => {
                            // Rollback on error
                            patchState(store, 
                                updateEntity({ 
                                    id, 
                                    changes: { status: 'Pending' } 
                                })
                            );
                            patchState(store, { 
                                error: 'Server rejected the approval. Check enrollment constraints.' 
                            });
                            return EMPTY;
                        })
                    )
                )
            )
        ),
        
        // Optimistic Reject
        rejectEnrollment: rxMethod<string>(
            pipe(
                tap((id) => {
                    patchState(store, 
                        updateEntity({ 
                            id, 
                            changes: { status: 'Rejected' } 
                        })
                    );
                }),
                concatMap((id) =>
                    api.reject(id).pipe(
                        catchError((err) => {
                            patchState(store, 
                                updateEntity({ 
                                    id, 
                                    changes: { status: 'Pending' } 
                                })
                            );
                            patchState(store, { 
                                error: 'Server rejected the rejection request.' 
                            });
                            return EMPTY;
                        })
                    )
                )
            )
        ),
        
        // Select an enrollment
        selectEnrollment(id: string) {
            patchState(store, { selectedId: id });
        },
        
        // Clear error
        clearError() {
            patchState(store, { error: null });
        },
    }))
);